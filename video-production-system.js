const VideoProductionSystem = {
  // Integration of all our tools for educational video production

  generateVideoScript: async function(videoId, gtmResources, agentInsights) {
    // Use Marketing Content Creator agent capabilities + GTM skills
    return {
      title: "Generated based on video concepts",
      duration: "8-12 minutes",
      structure: {
        hook: "Problem-focused opening",
        problem: "Specific service business challenges",
        solution: "GTM framework application",
        examples: "Real service business case studies",
        implementation: "Actionable next steps",
        cta: "Clear conversion opportunity"
      },
      gtmSkillsIntegration: [
        "Outbound frameworks for client examples",
        "ABM strategies for high-value services",
        "RevOps systems for scalability stories"
      ],
      agentPerspectives: {
        contentCreator: "Storytelling and engagement focus",
        salesStrategist: "Client acquisition insights",
        marketingSpecialist: "Multi-channel coordination"
      }
    };
  },

  createVideoAssets: async function(script, voiceSettings) {
    const ElevenLabs = require('./lib/elevenlabs');
    const VideoGenerator = require('./lib/videoGenerator');

    const generator = new VideoGenerator();

    // Generate voiceover using ElevenLabs
    const audioPath = await generator.generateAudioFromText(
      script.voiceoverText,
      voiceSettings.voiceId,
      `${script.title}-voiceover.mp3`
    );

    // Create video with Remotion
    const videoPath = await generator.renderRemotionVideo({
      titleText: script.title,
      titleColor: "#2563eb", // Professional blue
      audioPath: audioPath
    }, `${script.title}-final.mp4`);

    return {
      audio: audioPath,
      video: videoPath,
      thumbnail: `Generate using script.title and key concepts`,
      socialClips: "Break into 30-60s clips for social media",
      blogPost: "Convert script to written content",
      podcastVersion: "Audio-only version for podcast distribution"
    };
  },

  productionWorkflow: {
    phase1_concept: {
      duration: "1 day",
      deliverables: [
        "Video concept from video-concepts.js",
        "Learning objectives defined",
        "GTM skills mapped to content",
        "Target audience confirmed"
      ]
    },

    phase2_script: {
      duration: "2 days",
      deliverables: [
        "Full script with timings",
        "Visual direction notes",
        "On-screen text callouts",
        "Key phrase emphasis guide"
      ],
      agents_involved: [
        "Marketing Content Creator - storytelling structure",
        "Sales specialists - client examples and case studies",
        "Strategy agents - framework development"
      ]
    },

    phase3_production: {
      duration: "1 day",
      deliverables: [
        "Professional voiceover (ElevenLabs)",
        "Video with animations (Remotion)",
        "Thumbnail and social assets",
        "Quality review and edits"
      ]
    },

    phase4_distribution: {
      duration: "1 day",
      deliverables: [
        "YouTube upload with SEO optimization",
        "Social media clips and posts",
        "Blog post version",
        "Email newsletter content",
        "LinkedIn article adaptation"
      ]
    }
  },

  contentRepurposing: {
    youtube: {
      mainVideo: "Full 8-12 minute educational content",
      shorts: "Key points as 60-second vertical videos",
      playlist: "GTM Mastery for Service Businesses series"
    },

    socialMedia: {
      linkedin: [
        "Article version of video content",
        "Carousel posts with key frameworks",
        "Video clips with professional commentary",
        "Poll questions based on video topics"
      ],
      twitter: [
        "Thread breaking down key concepts",
        "Quote graphics with main insights",
        "Short video clips with captions"
      ]
    },

    leadMagnets: {
      approach: "Pure value, no sales pitch",
      purpose: "Build authority and capture qualified leads through education",
      gatedContent: [
        "GTM Readiness Assessment - Video 1",
        "Outbound Email Templates Library - Video 2",
        "ABM Account Selection Framework - Video 3",
        "RevOps Setup Checklist - Video 4",
        "GTM Failure Prevention Audit - Video 5",
        "GTM ROI Calculator - Video 6",
        "GTM Implementation Timeline - Video 7",
        "90-Day GTM Quick Start Guide - Video 8",
        "GTM Channel Selection Matrix - Video 9",
        "Geographic Expansion Playbook - Video 10",
        "GTM Metrics Dashboard Template - Video 11",
        "Service Business GTM Case Study Collection - Video 12"
      ],
      emailSequence: "Educational nurture series with additional GTM insights, no sales content"
    },

    webContent: {
      blogPosts: "Long-form written version of each video",
      landingPages: "Topic-specific conversion pages",
      resourceHub: "Central GTM knowledge base",
      caseStudies: "Detailed client success stories"
    }
  },

  measurementStrategy: {
    engagementMetrics: [
      "Video completion rate",
      "Comments and questions quality",
      "Shares and saves",
      "Click-through to resources"
    ],

    conversionMetrics: [
      "Assessment downloads",
      "Email sign-ups",
      "Consultation bookings",
      "Course/service inquiries"
    ],

    businessMetrics: [
      "Qualified leads generated",
      "Pipeline value influenced",
      "Client acquisition cost",
      "Revenue attributed to content"
    ],

    contentOptimization: [
      "A/B testing thumbnails and titles",
      "Script structure performance analysis",
      "Optimal posting times and frequency",
      "Cross-platform performance comparison"
    ]
  },

  scalingStrategy: {
    batchProduction: "Record multiple videos in single sessions",
    templateSystems: "Reusable script and visual templates",
    contentCalendar: "Strategic release schedule for maximum impact",
    guestContent: "Client success stories and case studies",
    seriesExpansion: "Advanced GTM topics for experienced audiences"
  }
};

module.exports = VideoProductionSystem;