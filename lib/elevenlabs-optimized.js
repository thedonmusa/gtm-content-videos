require('dotenv').config();
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const { APIError, AuthenticationError, ValidationError } = require('./errors');
const Cache = require('./utils/cache');
const RateLimiter = require('./utils/rateLimiter');
const Logger = require('./utils/logger');
const { validate } = require('./utils/validation');

class ElevenLabsOptimized {
  constructor() {
    this.apiKey = process.env.ELEVENLABS_API_KEY;
    if (!this.apiKey) {
      throw new AuthenticationError('ELEVENLABS_API_KEY not found in environment', 'ElevenLabs');
    }

    this.baseURL = 'https://api.elevenlabs.io/v1';
    this.cache = new Cache(3600000);
    this.rateLimiter = new RateLimiter(20, 60000);

    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'xi-api-key': this.apiKey,
      },
    });

    this.axiosInstance.interceptors.response.use(
      (response) => {
        Logger.debug(`ElevenLabs API success: ${response.config.url}`);
        return response;
      },
      (error) => {
        Logger.error(`ElevenLabs API error: ${error.message}`);
        return Promise.reject(error);
      }
    );

    setInterval(() => {
      this.cache.cleanup();
      this.rateLimiter.cleanup();
    }, 300000);
  }

  async getVoices(useCache = true) {
    const cacheKey = 'voices';

    if (useCache) {
      const cachedVoices = this.cache.get(cacheKey);
      if (cachedVoices) {
        Logger.info('Returning cached voices');
        return cachedVoices;
      }
    }

    try {
      await this.rateLimiter.checkLimit('getVoices');
      const response = await this.axiosInstance.get('/voices');
      const voices = response.data.voices;

      this.cache.set(cacheKey, voices, 7200000);
      Logger.info(`Fetched ${voices.length} voices from API`);

      return voices;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new AuthenticationError('Invalid API key', 'ElevenLabs');
      }
      throw new APIError(
        `Failed to get voices: ${error.message}`,
        error.response?.status || 500,
        'ElevenLabs',
        error.response?.data
      );
    }
  }

  async textToSpeech(text, voiceId = '21m00Tcm4TlvDq8ikWAM', options = {}) {
    const validatedData = validate(
      { text, voiceId, options },
      'textToSpeech'
    );

    const cacheKey = `tts_${voiceId}_${Buffer.from(text).toString('base64').slice(0, 50)}`;
    const cachedAudio = this.cache.get(cacheKey);

    if (cachedAudio && options.useCache !== false) {
      Logger.info('Returning cached audio');
      return cachedAudio;
    }

    try {
      await this.rateLimiter.checkLimit('textToSpeech');

      const payload = {
        text: validatedData.text,
        model_id: options.model_id || 'eleven_monolingual_v1',
        voice_settings: {
          stability: options.stability || 0.5,
          similarity_boost: options.similarity_boost || 0.8,
          style: options.style || 0.0,
          use_speaker_boost: options.use_speaker_boost !== false,
        },
      };

      const response = await this.axiosInstance.post(
        `/text-to-speech/${voiceId}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'audio/mpeg',
          },
          responseType: 'arraybuffer',
        }
      );

      const audioData = response.data;

      if (options.useCache !== false) {
        this.cache.set(cacheKey, audioData);
      }

      Logger.info(`Generated ${text.length} characters of speech`);
      return audioData;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new AuthenticationError('Invalid API key', 'ElevenLabs');
      }
      if (error.response?.status === 429) {
        throw new RateLimitError('ElevenLabs API rate limit exceeded', 60);
      }
      throw new APIError(
        `Failed to generate speech: ${error.message}`,
        error.response?.status || 500,
        'ElevenLabs',
        error.response?.data
      );
    }
  }

  async saveAudioFile(audioData, filename = 'output.mp3') {
    try {
      const outputDir = path.join(process.cwd(), 'out');
      await fs.mkdir(outputDir, { recursive: true });

      const fullPath = path.join(outputDir, filename);
      await fs.writeFile(fullPath, audioData);

      Logger.info(`Audio saved to ${fullPath}`);
      return fullPath;
    } catch (error) {
      throw new APIError(`Failed to save audio file: ${error.message}`, 500, 'FileSystem');
    }
  }

  async getUserInfo() {
    const cacheKey = 'userInfo';
    const cachedInfo = this.cache.get(cacheKey);

    if (cachedInfo) {
      return cachedInfo;
    }

    try {
      await this.rateLimiter.checkLimit('getUserInfo');
      const response = await this.axiosInstance.get('/user');
      const userInfo = response.data;

      this.cache.set(cacheKey, userInfo, 1800000);
      return userInfo;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new AuthenticationError('Invalid API key', 'ElevenLabs');
      }
      throw new APIError(
        `Failed to get user info: ${error.message}`,
        error.response?.status || 500,
        'ElevenLabs'
      );
    }
  }

  async getModels() {
    const cacheKey = 'models';
    const cachedModels = this.cache.get(cacheKey);

    if (cachedModels) {
      return cachedModels;
    }

    try {
      await this.rateLimiter.checkLimit('getModels');
      const response = await this.axiosInstance.get('/models');
      const models = response.data;

      this.cache.set(cacheKey, models, 86400000);
      return models;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new AuthenticationError('Invalid API key', 'ElevenLabs');
      }
      throw new APIError(
        `Failed to get models: ${error.message}`,
        error.response?.status || 500,
        'ElevenLabs'
      );
    }
  }

  getCacheStats() {
    return this.cache.getStats();
  }

  getRateLimiterStatus(key = 'default') {
    return {
      remaining: this.rateLimiter.getRemainingRequests(key),
      maxRequests: this.rateLimiter.maxRequests,
      windowMs: this.rateLimiter.windowMs,
    };
  }

  clearCache() {
    this.cache.clear();
    Logger.info('Cache cleared');
  }
}

module.exports = ElevenLabsOptimized;