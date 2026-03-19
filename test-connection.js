require('dotenv').config();
const axios = require('axios');

async function testElevenLabsConnection() {
    try {
        const response = await axios.get('https://api.elevenlabs.io/v1/user', {
            headers: {
                'xi-api-key': process.env.ELEVENLABS_API_KEY
            }
        });
        console.log('✅ ElevenLabs connection successful');
        console.log('User ID:', response.data.subscription?.character_count || 'N/A');
        return true;
    } catch (error) {
        console.log('❌ ElevenLabs connection failed:', error.response?.data || error.message);
        return false;
    }
}

async function testHeyGenConnection() {
    try {
        const response = await axios.get('https://api.heygen.com/v2/avatars', {
            headers: {
                'X-API-KEY': process.env.HEYGEN_API_KEY
            }
        });
        console.log('✅ HeyGen connection successful');
        console.log('Avatars found:', response.data.data?.avatars?.length || 0);
        return true;
    } catch (error) {
        console.log('❌ HeyGen connection failed:', error.response?.data || error.message);
        return false;
    }
}

async function testConnections() {
    console.log('Testing API connections...\n');

    const elevenLabsOK = await testElevenLabsConnection();
    const heyGenOK = await testHeyGenConnection();

    console.log('\n--- Connection Summary ---');
    console.log(`ElevenLabs: ${elevenLabsOK ? '✅ Connected' : '❌ Failed'}`);
    console.log(`HeyGen: ${heyGenOK ? '✅ Connected' : '❌ Failed'}`);

    if (elevenLabsOK && heyGenOK) {
        console.log('\n🎉 All APIs connected successfully!');
    } else {
        console.log('\n⚠️ Check your API keys in .env file');
    }
}

testConnections();