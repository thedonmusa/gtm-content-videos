const ElevenLabs = require('./elevenlabs');
const HeyGen = require('./heygen');
const {bundle} = require('@remotion/bundler');
const {renderMedia, selectComposition} = require('@remotion/renderer');
const path = require('path');
const fs = require('fs');

class VideoGenerator {
    constructor() {
        this.elevenlabs = new ElevenLabs();
        this.heygen = new HeyGen();
        this.outputDir = path.join(process.cwd(), 'out');

        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }
    }

    async generateAudioFromText(text, voiceId, outputPath = 'temp-audio.mp3') {
        try {
            console.log('🎤 Generating audio with ElevenLabs...');
            const audioData = await this.elevenlabs.textToSpeech(text, voiceId);
            const audioPath = path.join(this.outputDir, outputPath);
            await this.elevenlabs.saveAudioFile(audioData, audioPath);
            console.log(`✅ Audio saved to: ${audioPath}`);
            return audioPath;
        } catch (error) {
            throw new Error(`Audio generation failed: ${error.message}`);
        }
    }

    async createHeyGenVideo(options) {
        try {
            console.log('🎬 Creating video with HeyGen...');
            const video = await this.heygen.createVideo(options);
            console.log(`✅ HeyGen video created: ${video.video_id}`);
            return video;
        } catch (error) {
            throw new Error(`HeyGen video creation failed: ${error.message}`);
        }
    }

    async renderRemotionVideo(inputProps, outputPath = 'final-video.mp4') {
        try {
            console.log('🎥 Rendering video with Remotion...');

            const bundleLocation = await bundle(
                path.join(process.cwd(), 'src', 'Video.jsx'),
                undefined,
                {
                    webpackOverride: (config) => config,
                }
            );

            const comps = await selectComposition({
                serveUrl: bundleLocation,
                id: 'MyComp',
                inputProps,
            });

            const composition = comps[0];
            const finalOutputPath = path.join(this.outputDir, outputPath);

            await renderMedia({
                composition,
                serveUrl: bundleLocation,
                codec: 'h264',
                outputLocation: finalOutputPath,
                inputProps,
            });

            console.log(`✅ Remotion video rendered: ${finalOutputPath}`);
            return finalOutputPath;
        } catch (error) {
            throw new Error(`Remotion rendering failed: ${error.message}`);
        }
    }

    async createCompleteVideo(options = {}) {
        const {
            text = "Welcome to our video!",
            titleText = "AI Generated Video",
            titleColor = "#ffffff",
            voiceId,
            useElevenLabs = true,
            useHeyGen = false,
            heygenOptions = {}
        } = options;

        try {
            console.log('🚀 Starting complete video generation...');

            let audioPath = null;
            let heygenVideo = null;

            // Generate audio if requested
            if (useElevenLabs && voiceId) {
                audioPath = await this.generateAudioFromText(text, voiceId);
            }

            // Create HeyGen video if requested
            if (useHeyGen) {
                heygenVideo = await this.createHeyGenVideo({
                    text,
                    ...heygenOptions
                });
            }

            // Render Remotion video
            const videoPath = await this.renderRemotionVideo({
                titleText,
                titleColor,
                audioPath
            });

            return {
                videoPath,
                audioPath,
                heygenVideo,
                success: true
            };

        } catch (error) {
            console.error('❌ Video generation failed:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = VideoGenerator;