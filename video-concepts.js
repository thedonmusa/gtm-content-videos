// GTM Educational Video Series for Service Businesses
// Leveraging GTM Skills + Marketing Content Creator Agent capabilities

const GTM_VIDEO_CONCEPTS = {
  series_overview: {
    title: "GTM Mastery for Service Businesses",
    target_audience: "Service business owners, consultants, agencies, professional services",
    core_pillars: ["What", "Why", "When", "Where", "Value"],
    total_videos: 12,
    video_length: "8-12 minutes each",
    format: "Educational + Practical examples"
  },

  video_concepts: [
    // WHAT Series (4 videos)
    {
      id: 1,
      title: "GTM Foundations: What Every Service Business Owner Must Know",
      pillar: "What",
      duration: "10 minutes",
      learning_objectives: [
        "Define Go-to-Market strategy for service businesses",
        "Understand the 3 core GTM components: Target Market, Value Proposition, Sales Process",
        "Distinguish GTM from traditional marketing"
      ],
      key_points: [
        "GTM is your roadmap from product to paying customer",
        "Service businesses have unique GTM challenges vs product companies",
        "The 3-pillar framework: WHO (target), WHAT (value), HOW (delivery)"
      ],
      practical_examples: [
        "Consulting firm targeting mid-market manufacturers",
        "Digital agency focusing on e-commerce brands",
        "Professional services for healthcare organizations"
      ],
      gtm_skills_used: ["outbound/copywriting", "revops/lifecycle-model"],
      agent_perspective: "Marketing Content Creator - storytelling focus"
    },

    {
      id: 2,
      title: "The Outbound Engine: Building Your Client Acquisition Machine",
      pillar: "What",
      duration: "12 minutes",
      learning_objectives: [
        "Understand outbound as the backbone of service business GTM",
        "Learn the 4 pillars of outbound: List Building, Email Infrastructure, Copywriting, Sales Process",
        "See how outbound integrates with other GTM channels"
      ],
      key_points: [
        "Why outbound is perfect for high-value service businesses",
        "The outbound funnel: Prospect → Engage → Qualify → Close",
        "Common outbound mistakes that kill response rates"
      ],
      practical_examples: [
        "B2B SaaS consultant using LinkedIn + email sequences",
        "Management consulting firm targeting Fortune 500 companies",
        "Marketing agency prospecting e-commerce brands"
      ],
      gtm_skills_used: ["outbound/list-building", "outbound/email-infra", "outbound/copywriting"],
      agent_perspective: "Sales Outbound Strategist + Content Creator collaboration"
    },

    {
      id: 3,
      title: "Account-Based Marketing for High-Value Service Contracts",
      pillar: "What",
      duration: "11 minutes",
      learning_objectives: [
        "Understand when ABM makes sense for service businesses",
        "Learn account selection and persona mapping frameworks",
        "See how to coordinate ads + outbound for maximum impact"
      ],
      key_points: [
        "ABM is perfect for services with 6-figure+ contract values",
        "Account selection framework: fit, intent, accessibility",
        "Multi-touch ABM: ads create awareness, outbound creates meetings"
      ],
      practical_examples: [
        "Enterprise consulting firm targeting 50 key accounts",
        "Cybersecurity services company using LinkedIn ads + outreach",
        "Digital transformation consultancy running ABM campaigns"
      ],
      gtm_skills_used: ["abm/account-targeting", "abm/retargeting", "abm/measurement"],
      agent_perspective: "Marketing strategist focus on multi-channel coordination"
    },

    {
      id: 4,
      title: "Revenue Operations: The GTM Operating System",
      pillar: "What",
      duration: "9 minutes",
      learning_objectives: [
        "Understand RevOps as the foundation that makes GTM scalable",
        "Learn the core RevOps functions: data, process, technology",
        "See how RevOps prevents GTM from breaking as you grow"
      ],
      key_points: [
        "RevOps ensures your GTM engine doesn't break at scale",
        "The RevOps trinity: Sales Ops + Marketing Ops + Customer Success Ops",
        "Key systems: CRM, data enrichment, lead routing, reporting"
      ],
      practical_examples: [
        "Professional services firm scaling from $1M to $10M ARR",
        "Agency implementing lead scoring and routing",
        "Consultancy building territory and capacity planning"
      ],
      gtm_skills_used: ["revops/pipeline-reporting", "revops/lead-management", "revops/data-governance"],
      agent_perspective: "Systems thinking and process optimization focus"
    },

    // WHY Series (2 videos)
    {
      id: 5,
      title: "Why Service Businesses FAIL Without GTM Strategy",
      pillar: "Why",
      duration: "10 minutes",
      learning_objectives: [
        "Understand the cost of not having a GTM strategy",
        "See real failure cases and their root causes",
        "Learn the competitive disadvantage of ad-hoc approaches"
      ],
      key_points: [
        "Random acts of marketing waste time and money",
        "Without GTM, you're always starting from scratch",
        "Clients can sense when you don't have your act together"
      ],
      practical_examples: [
        "Consulting firm burning $50K/month on ineffective marketing",
        "Agency losing deals because of inconsistent messaging",
        "Professional services stuck in feast-or-famine cycles"
      ],
      gtm_skills_used: ["measurement frameworks", "copywriting principles"],
      agent_perspective: "Story-driven content highlighting pain points"
    },

    {
      id: 6,
      title: "The GTM Advantage: Why Systematic Beats Random",
      pillar: "Why",
      duration: "11 minutes",
      learning_objectives: [
        "Understand the compounding benefits of systematic GTM",
        "See how GTM creates predictable revenue growth",
        "Learn why GTM is essential for scaling service businesses"
      ],
      key_points: [
        "GTM creates predictable, scalable revenue growth",
        "Systematic approach builds market authority and trust",
        "GTM enables you to scale beyond the founder's personal network"
      ],
      practical_examples: [
        "Consultancy growing 300% year-over-year with systematic outbound",
        "Agency building waitlist through strategic content + ABM",
        "Professional services firm achieving 95% revenue predictability"
      ],
      gtm_skills_used: ["measurement frameworks", "account selection"],
      agent_perspective: "Success story focus with data-driven results"
    },

    // WHEN Series (2 videos)
    {
      id: 7,
      title: "GTM Timing: When to Invest in Go-to-Market Strategy",
      pillar: "When",
      duration: "9 minutes",
      learning_objectives: [
        "Identify the right time to implement GTM strategy",
        "Understand the signals that indicate GTM readiness",
        "Learn the phases of GTM implementation"
      ],
      key_points: [
        "Signs you're ready: proven service, early traction, growth ambitions",
        "Warning signs you're not ready: undefined service, no case studies, resource constraints",
        "The 3 phases: Foundation, Scale, Optimize"
      ],
      practical_examples: [
        "Bootstrap consultancy at $500K ARR implementing first GTM system",
        "Established agency at $2M ARR adding ABM to existing outbound",
        "Growing firm at $5M ARR optimizing and systematizing processes"
      ],
      gtm_skills_used: ["lifecycle frameworks", "capacity planning"],
      agent_perspective: "Decision framework and readiness assessment"
    },

    {
      id: 8,
      title: "GTM Implementation Roadmap: Your 90-Day Action Plan",
      pillar: "When",
      duration: "12 minutes",
      learning_objectives: [
        "Get a concrete 90-day GTM implementation plan",
        "Understand sequencing and prioritization of GTM initiatives",
        "Learn how to measure progress and adjust strategy"
      ],
      key_points: [
        "Month 1: Foundation (ICP, messaging, basic outbound)",
        "Month 2: Scale (systems, process, measurement)",
        "Month 3: Optimize (data analysis, refinement, advanced tactics)"
      ],
      practical_examples: [
        "Week-by-week implementation checklist",
        "Common roadblocks and how to overcome them",
        "Success metrics to track at each phase"
      ],
      gtm_skills_used: ["all core frameworks", "measurement systems"],
      agent_perspective: "Actionable playbook with step-by-step guidance"
    },

    // WHERE Series (2 videos)
    {
      id: 9,
      title: "GTM Channel Strategy: Where to Find Your Best Clients",
      pillar: "Where",
      duration: "10 minutes",
      learning_objectives: [
        "Understand channel selection for service businesses",
        "Learn how to match channels to client behavior and deal size",
        "See channel integration strategies that work"
      ],
      key_points: [
        "Channel choice depends on deal size, sales cycle, and buyer behavior",
        "High-value services: outbound + ABM + content",
        "Volume services: inbound + paid ads + partnerships"
      ],
      practical_examples: [
        "Enterprise consulting: LinkedIn + email + events",
        "SMB services: Google Ads + content marketing + referrals",
        "Mid-market focus: ABM + outbound + thought leadership"
      ],
      gtm_skills_used: ["channel strategy", "audience targeting"],
      agent_perspective: "Strategic channel selection and integration"
    },

    {
      id: 10,
      title: "Geographic GTM: Local vs National vs Global Service Markets",
      pillar: "Where",
      duration: "8 minutes",
      learning_objectives: [
        "Understand geographic considerations for service GTM",
        "Learn market entry strategies for expansion",
        "See how geography affects GTM channel mix"
      ],
      key_points: [
        "Local: referrals, networking, local SEO, community presence",
        "National: digital channels, industry events, thought leadership",
        "Global: partnerships, time zone considerations, cultural adaptation"
      ],
      practical_examples: [
        "Local professional services firm expanding regionally",
        "National consultancy entering international markets",
        "Global agency coordinating multi-market GTM"
      ],
      gtm_skills_used: ["territory planning", "market analysis"],
      agent_perspective: "Geographic expansion strategy and execution"
    },

    // VALUE Series (2 videos)
    {
      id: 11,
      title: "Measuring GTM ROI: Proving Value to Your Business",
      pillar: "Value",
      duration: "11 minutes",
      learning_objectives: [
        "Learn how to measure GTM investment returns",
        "Understand leading and lagging indicators of GTM success",
        "Set up dashboard and reporting for GTM performance"
      ],
      key_points: [
        "GTM metrics that matter: pipeline velocity, deal size, win rate, CAC",
        "Leading indicators: activity metrics, response rates, meeting quality",
        "Attribution: connecting GTM activities to revenue outcomes"
      ],
      practical_examples: [
        "Professional services firm tracking $500K in GTM-driven revenue",
        "Consultancy reducing CAC by 60% through systematic GTM",
        "Agency increasing average deal size 3x through better targeting"
      ],
      gtm_skills_used: ["pipeline reporting", "measurement frameworks"],
      agent_perspective: "Data analysis and ROI calculation focus"
    },

    {
      id: 12,
      title: "GTM Success Stories: Real Results from Real Service Businesses",
      pillar: "Value",
      duration: "12 minutes",
      learning_objectives: [
        "See concrete results from GTM implementation",
        "Understand the transformation journey and timeline",
        "Get inspired and motivated to start your own GTM journey"
      ],
      key_points: [
        "Case study 1: Consultancy 10x revenue in 18 months",
        "Case study 2: Agency building 6-month sales pipeline",
        "Case study 3: Professional services achieving 95% retention"
      ],
      practical_examples: [
        "Before/after metrics and transformation stories",
        "Specific tactics that drove the biggest results",
        "Lessons learned and advice for implementation"
      ],
      gtm_skills_used: ["success measurement", "case study development"],
      agent_perspective: "Inspirational storytelling with concrete data"
    }
  ],

  production_notes: {
    visual_style: "Professional but approachable, whiteboard-style animations",
    presenter_style: "Expert but not intimidating, practical focus",
    call_to_action: "Download valuable lead magnets - no sales pitch",
    series_progression: "Each video builds on previous concepts, can stand alone",
    repurposing_strategy: "Break into short clips for social, create blog posts, develop podcast episodes"
  },

  lead_magnets: {
    video_1: {
      title: "GTM Readiness Assessment",
      description: "Self-assessment tool to evaluate your current GTM maturity and identify priority areas",
      format: "Interactive PDF checklist"
    },
    video_2: {
      title: "Outbound Email Templates Library",
      description: "50+ proven email templates for service business outbound campaigns",
      format: "Swipe file collection"
    },
    video_3: {
      title: "ABM Account Selection Framework",
      description: "Step-by-step guide to identify and prioritize high-value target accounts",
      format: "Worksheet + video walkthrough"
    },
    video_4: {
      title: "RevOps Setup Checklist",
      description: "Complete checklist for building revenue operations foundation",
      format: "Implementation guide"
    },
    video_5: {
      title: "GTM Failure Prevention Audit",
      description: "25-point audit to identify and fix GTM vulnerabilities before they hurt your business",
      format: "Audit checklist + action plan"
    },
    video_6: {
      title: "GTM ROI Calculator",
      description: "Excel calculator to project and measure GTM investment returns",
      format: "Excel spreadsheet + instructions"
    },
    video_7: {
      title: "GTM Implementation Timeline",
      description: "Week-by-week roadmap for implementing GTM strategy",
      format: "Project plan template"
    },
    video_8: {
      title: "90-Day GTM Quick Start Guide",
      description: "Condensed action plan for rapid GTM implementation",
      format: "PDF playbook"
    },
    video_9: {
      title: "GTM Channel Selection Matrix",
      description: "Framework for choosing the right channels for your service business",
      format: "Decision matrix tool"
    },
    video_10: {
      title: "Geographic Expansion Playbook",
      description: "Strategic guide for expanding GTM to new markets",
      format: "Multi-page strategy guide"
    },
    video_11: {
      title: "GTM Metrics Dashboard Template",
      description: "Pre-built dashboard for tracking GTM performance",
      format: "Google Sheets template"
    },
    video_12: {
      title: "Service Business GTM Case Study Collection",
      description: "10 detailed case studies showing GTM transformations",
      format: "PDF collection + analysis"
    }
  }
};

module.exports = GTM_VIDEO_CONCEPTS;