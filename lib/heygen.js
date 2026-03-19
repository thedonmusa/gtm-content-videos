require('dotenv').config();
const axios = require('axios');

class HeyGen {
    constructor() {
        this.apiKey = process.env.HEYGEN_API_KEY;
        this.baseURL = 'https://api.heygen.com/v2';
    }

    async getAvatars() {
        try {
            const response = await axios.get(`${this.baseURL}/avatars`, {
                headers: { 'X-API-KEY': this.apiKey }
            });
            return response.data.data.avatars;
        } catch (error) {
            throw new Error(`Failed to get avatars: ${error.response?.data?.message || error.message}`);
        }
    }

    async getVoices() {
        try {
            const response = await axios.get(`${this.baseURL}/voices`, {
                headers: { 'X-API-KEY': this.apiKey }
            });
            return response.data.data.voices;
        } catch (error) {
            throw new Error(`Failed to get voices: ${error.response?.data?.message || error.message}`);
        }
    }

    async createVideo(options = {}) {
        try {
            const payload = {
                video_inputs: [{
                    character: {
                        type: "avatar",
                        avatar_id: options.avatar_id || "default_avatar",
                        scale: options.scale || 1
                    },
                    voice: {
                        type: "text",
                        input_text: options.text || "Hello, this is a test video.",
                        voice_id: options.voice_id || "default_voice"
                    },
                    background: {
                        type: options.background_type || "color",
                        value: options.background_value || "#ffffff"
                    }
                }],
                dimension: {
                    width: options.width || 1280,
                    height: options.height || 720
                },
                aspect_ratio: options.aspect_ratio || "16:9"
            };

            if (options.title) {
                payload.title = options.title;
            }

            const response = await axios.post(`${this.baseURL}/video/generate`, payload, {
                headers: {
                    'X-API-KEY': this.apiKey,
                    'Content-Type': 'application/json'
                }
            });

            return response.data.data;
        } catch (error) {
            throw new Error(`Failed to create video: ${error.response?.data?.message || error.message}`);
        }
    }

    async getVideoStatus(videoId) {
        try {
            const response = await axios.get(`${this.baseURL}/video/${videoId}`, {
                headers: { 'X-API-KEY': this.apiKey }
            });
            return response.data.data;
        } catch (error) {
            throw new Error(`Failed to get video status: ${error.response?.data?.message || error.message}`);
        }
    }

    async listVideos() {
        try {
            const response = await axios.get(`${this.baseURL}/videos`, {
                headers: { 'X-API-KEY': this.apiKey }
            });
            return response.data.data.videos;
        } catch (error) {
            throw new Error(`Failed to list videos: ${error.response?.data?.message || error.message}`);
        }
    }

    async getUserCredits() {
        try {
            const response = await axios.get(`${this.baseURL}/user/remaining_quota`, {
                headers: { 'X-API-KEY': this.apiKey }
            });
            return response.data.data;
        } catch (error) {
            throw new Error(`Failed to get user credits: ${error.response?.data?.message || error.message}`);
        }
    }

    async deleteVideo(videoId) {
        try {
            const response = await axios.delete(`${this.baseURL}/video/${videoId}`, {
                headers: { 'X-API-KEY': this.apiKey }
            });
            return response.data;
        } catch (error) {
            throw new Error(`Failed to delete video: ${error.response?.data?.message || error.message}`);
        }
    }
}

module.exports = HeyGen;