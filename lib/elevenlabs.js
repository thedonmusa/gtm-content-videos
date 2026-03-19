require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

class ElevenLabs {
    constructor() {
        this.apiKey = process.env.ELEVENLABS_API_KEY;
        this.baseURL = 'https://api.elevenlabs.io/v1';
    }

    async getVoices() {
        try {
            const response = await axios.get(`${this.baseURL}/voices`, {
                headers: { 'xi-api-key': this.apiKey }
            });
            return response.data.voices;
        } catch (error) {
            throw new Error(`Failed to get voices: ${error.response?.data?.detail?.message || error.message}`);
        }
    }

    async textToSpeech(text, voiceId = '21m00Tcm4TlvDq8ikWAM', options = {}) {
        try {
            const payload = {
                text: text,
                model_id: options.model_id || 'eleven_monolingual_v1',
                voice_settings: {
                    stability: options.stability || 0.5,
                    similarity_boost: options.similarity_boost || 0.8,
                    style: options.style || 0.0,
                    use_speaker_boost: options.use_speaker_boost || true
                }
            };

            const response = await axios.post(
                `${this.baseURL}/text-to-speech/${voiceId}`,
                payload,
                {
                    headers: {
                        'xi-api-key': this.apiKey,
                        'Content-Type': 'application/json',
                        'Accept': 'audio/mpeg'
                    },
                    responseType: 'arraybuffer'
                }
            );

            return response.data;
        } catch (error) {
            throw new Error(`Failed to generate speech: ${error.response?.data?.detail?.message || error.message}`);
        }
    }

    async saveAudioFile(audioData, filename = 'output.mp3') {
        try {
            fs.writeFileSync(filename, audioData);
            return filename;
        } catch (error) {
            throw new Error(`Failed to save audio file: ${error.message}`);
        }
    }

    async getUserInfo() {
        try {
            const response = await axios.get(`${this.baseURL}/user`, {
                headers: { 'xi-api-key': this.apiKey }
            });
            return response.data;
        } catch (error) {
            throw new Error(`Failed to get user info: ${error.response?.data?.detail?.message || error.message}`);
        }
    }

    async getModels() {
        try {
            const response = await axios.get(`${this.baseURL}/models`, {
                headers: { 'xi-api-key': this.apiKey }
            });
            return response.data;
        } catch (error) {
            throw new Error(`Failed to get models: ${error.response?.data?.detail?.message || error.message}`);
        }
    }
}

module.exports = ElevenLabs;