import {interpolate, useCurrentFrame, useVideoConfig, Sequence} from 'remotion';

export const GTMEducationVideo = () => {
	const frame = useCurrentFrame();
	const {durationInFrames, fps, width, height} = useVideoConfig();

	// Video sections with timing (30fps = 30 frames per second)
	const sections = [
		{
			id: 'intro',
			start: 0,
			duration: 900, // 30 seconds
			title: 'GTM Foundations',
			subtitle: 'What Every Service Business Owner Must Know',
			content: 'End the feast-or-famine cycle'
		},
		{
			id: 'problem',
			start: 900,
			duration: 1350, // 45 seconds
			title: 'The Problem',
			subtitle: 'Random Marketing Activities',
			content: 'LinkedIn → Google Ads → Cold Email → Podcasts → Exhaustion'
		},
		{
			id: 'solution',
			start: 2250,
			duration: 900, // 30 seconds
			title: 'The Solution',
			subtitle: 'Go-to-Market Strategy',
			content: 'Your Client Acquisition Operating System'
		},
		{
			id: 'framework',
			start: 3150,
			duration: 2700, // 90 seconds
			title: 'The 3-Pillar Framework',
			subtitle: 'WHO • WHAT • HOW',
			content: 'Systematic client acquisition for service businesses'
		},
		{
			id: 'examples',
			start: 5850,
			duration: 1800, // 60 seconds
			title: 'Real Examples',
			subtitle: '$500K → $1.2M in 18 months',
			content: 'Manufacturing consultancy success story'
		},
		{
			id: 'cta',
			start: 7650,
			duration: 1350, // 45 seconds
			title: 'Take Action',
			subtitle: 'Define Your 3 Pillars',
			content: 'FREE GTM Readiness Assessment'
		}
	];

	// Current section based on frame
	const currentSection = sections.find(
		section => frame >= section.start && frame < section.start + section.duration
	) || sections[0];

	const sectionProgress = (frame - currentSection.start) / currentSection.duration;

	// Animation values
	const titleOpacity = interpolate(
		sectionProgress,
		[0, 0.1, 0.9, 1],
		[0, 1, 1, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
	);

	const titleScale = interpolate(
		sectionProgress,
		[0, 0.1, 0.9, 1],
		[0.8, 1, 1, 1.1],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
	);

	const contentOpacity = interpolate(
		sectionProgress,
		[0, 0.2, 0.8, 1],
		[0, 1, 1, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
	);

	// Background gradient based on section
	const getBackgroundGradient = (sectionId) => {
		switch (sectionId) {
			case 'intro':
				return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
			case 'problem':
				return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
			case 'solution':
				return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
			case 'framework':
				return 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
			case 'examples':
				return 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)';
			case 'cta':
				return 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)';
			default:
				return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
		}
	};

	return (
		<div
			style={{
				width,
				height,
				background: getBackgroundGradient(currentSection.id),
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				fontFamily: 'Inter, Arial, sans-serif',
				color: 'white',
				textAlign: 'center',
				padding: '60px',
				position: 'relative',
			}}
		>
			{/* Animated background elements */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					opacity: 0.1,
					background: `radial-gradient(circle at ${50 + Math.sin(frame * 0.01) * 20}% ${50 + Math.cos(frame * 0.01) * 20}%, rgba(255,255,255,0.3) 0%, transparent 50%)`,
				}}
			/>

			{/* Main title */}
			<h1
				style={{
					fontSize: currentSection.id === 'framework' ? '72px' : '84px',
					fontWeight: '800',
					marginBottom: '30px',
					opacity: titleOpacity,
					transform: `scale(${titleScale})`,
					textShadow: '0 4px 20px rgba(0,0,0,0.3)',
					lineHeight: 1.1,
					maxWidth: '900px',
				}}
			>
				{currentSection.title}
			</h1>

			{/* Subtitle */}
			<h2
				style={{
					fontSize: '48px',
					fontWeight: '400',
					marginBottom: '40px',
					opacity: titleOpacity * 0.9,
					textShadow: '0 2px 10px rgba(0,0,0,0.3)',
					maxWidth: '800px',
				}}
			>
				{currentSection.subtitle}
			</h2>

			{/* Content text */}
			<p
				style={{
					fontSize: '36px',
					fontWeight: '300',
					opacity: contentOpacity,
					textShadow: '0 2px 10px rgba(0,0,0,0.2)',
					maxWidth: '1000px',
					lineHeight: 1.4,
					marginTop: '20px',
				}}
			>
				{currentSection.content}
			</p>

			{/* Section-specific visual elements */}
			{currentSection.id === 'framework' && (
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-around',
						width: '100%',
						marginTop: '60px',
						opacity: contentOpacity,
					}}
				>
					{['WHO', 'WHAT', 'HOW'].map((pillar, index) => (
						<div
							key={pillar}
							style={{
								background: 'rgba(255,255,255,0.2)',
								padding: '40px',
								borderRadius: '20px',
								backdropFilter: 'blur(10px)',
								border: '2px solid rgba(255,255,255,0.3)',
								transform: `translateY(${Math.sin((frame + index * 30) * 0.02) * 10}px)`,
							}}
						>
							<div
								style={{
									fontSize: '48px',
									fontWeight: '700',
									marginBottom: '20px',
								}}
							>
								{pillar}
							</div>
							<div
								style={{
									fontSize: '24px',
									fontWeight: '300',
								}}
							>
								{pillar === 'WHO' && 'Target Market'}
								{pillar === 'WHAT' && 'Value Proposition'}
								{pillar === 'HOW' && 'Delivery System'}
							</div>
						</div>
					))}
				</div>
			)}

			{/* Progress indicator */}
			<div
				style={{
					position: 'absolute',
					bottom: '40px',
					left: '60px',
					right: '60px',
					height: '4px',
					background: 'rgba(255,255,255,0.2)',
					borderRadius: '2px',
					overflow: 'hidden',
				}}
			>
				<div
					style={{
						height: '100%',
						background: 'white',
						borderRadius: '2px',
						width: `${(frame / durationInFrames) * 100}%`,
						transition: 'width 0.1s ease-out',
					}}
				/>
			</div>

			{/* Section indicator */}
			<div
				style={{
					position: 'absolute',
					top: '40px',
					right: '60px',
					fontSize: '18px',
					fontWeight: '500',
					opacity: 0.7,
					background: 'rgba(255,255,255,0.1)',
					padding: '12px 24px',
					borderRadius: '20px',
					backdropFilter: 'blur(10px)',
				}}
			>
				{sections.findIndex(s => s.id === currentSection.id) + 1} / {sections.length}
			</div>
		</div>
	);
};