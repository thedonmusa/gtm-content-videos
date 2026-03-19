const ElevenLabs = require('./lib/elevenlabs');
const HeyGen = require('./lib/heygen');

async function demoElevenLabs() {
    console.log('🎤 ElevenLabs Demo\n');

    const elevenlabs = new ElevenLabs();

    try {
        // Get user info
        console.log('📊 Getting user info...');
        const userInfo = await elevenlabs.getUserInfo();
        console.log('✅ User:', userInfo.email);

        // Get available voices
        console.log('\n🎵 Getting available voices...');
        const voices = await elevenlabs.getVoices();
        console.log(`✅ Found ${voices.length} voices`);
        voices.slice(0, 3).forEach(voice => {
            console.log(`  - ${voice.name} (${voice.voice_id})`);
        });

        // Generate speech
        const text = "Hello! This is a test of ElevenLabs text-to-speech integration.";
        console.log(`\n🔊 Generating speech: "${text}"`);

        const audioData = await elevenlabs.textToSpeech(text, voices[0].voice_id);
        const filename = await elevenlabs.saveAudioFile(audioData, 'demo-output.mp3');
        console.log(`✅ Audio saved to: ${filename}`);

    } catch (error) {
        console.log('❌ ElevenLabs demo failed:', error.message);
    }
}

async function demoHeyGen() {
    console.log('\n🎬 HeyGen Demo\n');

    const heygen = new HeyGen();

    try {
        // Get user credits
        console.log('💰 Getting user credits...');
        const credits = await heygen.getUserCredits();
        console.log('✅ Credits:', credits);

        // Get available avatars
        console.log('\n👤 Getting available avatars...');
        const avatars = await heygen.getAvatars();
        console.log(`✅ Found ${avatars.length} avatars`);
        avatars.slice(0, 3).forEach(avatar => {
            console.log(`  - ${avatar.name} (${avatar.avatar_id})`);
        });

        // Get available voices
        console.log('\n🎵 Getting available voices...');
        const voices = await heygen.getVoices();
        console.log(`✅ Found ${voices.length} voices`);
        voices.slice(0, 3).forEach(voice => {
            console.log(`  - ${voice.name} (${voice.voice_id})`);
        });

        // Create video (commented out to avoid charges)
        /*
        console.log('\n🎥 Creating video...');
        const videoOptions = {
            text: "Hello! This is a demo video created with HeyGen API.",
            avatar_id: avatars[0]?.avatar_id,
            voice_id: voices[0]?.voice_id,
            title: "Demo Video"
        };

        const video = await heygen.createVideo(videoOptions);
        console.log('✅ Video creation started:', video.video_id);
        */

    } catch (error) {
        console.log('❌ HeyGen demo failed:', error.message);
    }
}

async function runDemo() {
    console.log('🚀 API Integration Demo\n');

    await demoElevenLabs();
    await demoHeyGen();

    console.log('\n✨ Demo completed!');
}

runDemo();