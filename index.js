const ElevenLabs = require('./lib/elevenlabs');
const HeyGen = require('./lib/heygen');
const VideoGenerator = require('./lib/videoGenerator');

class GTMContentVideos {
    constructor() {
        this.elevenlabs = new ElevenLabs();
        this.heygen = new HeyGen();
        this.videoGenerator = new VideoGenerator();
    }

    async generateAudio(text, voiceId) {
        return await this.elevenlabs.textToSpeech(text, voiceId);
    }

    async createVideo(options) {
        return await this.heygen.createVideo(options);
    }

    async generateCompleteVideo(options) {
        return await this.videoGenerator.createCompleteVideo(options);
    }

    async getAvailableVoices() {
        return await this.elevenlabs.getVoices();
    }

    async getAvailableAvatars() {
        return await this.heygen.getAvatars();
    }
}

module.exports = GTMContentVideos;