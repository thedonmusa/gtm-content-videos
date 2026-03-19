const VideoGenerator = require('./lib/videoGenerator');
const ElevenLabs = require('./lib/elevenlabs');

async function generateVideo() {
    const generator = new VideoGenerator();
    const elevenlabs = new ElevenLabs();

    try {
        // Get available voices
        console.log('🔍 Getting available voices...');
        const voices = await elevenlabs.getVoices();
        const firstVoice = voices[0];

        if (!firstVoice) {
            throw new Error('No voices available');
        }

        console.log(`Using voice: ${firstVoice.name} (${firstVoice.voice_id})`);

        // Generate complete video
        const result = await generator.createCompleteVideo({
            text: "Hello! This is an AI-generated video combining ElevenLabs text-to-speech with Remotion video rendering.",
            titleText: "AI Video Demo",
            titleColor: "#ffffff",
            voiceId: firstVoice.voice_id,
            useElevenLabs: true,
            useHeyGen: false // Set to true if HeyGen is working
        });

        if (result.success) {
            console.log('\n🎉 Video generation completed successfully!');
            console.log(`📹 Video: ${result.videoPath}`);
            if (result.audioPath) {
                console.log(`🎵 Audio: ${result.audioPath}`);
            }
        } else {
            console.log('\n❌ Video generation failed:', result.error);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Run if called directly
if (require.main === module) {
    generateVideo();
}

module.exports = { generateVideo };