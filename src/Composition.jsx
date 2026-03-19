import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export const MyComposition = ({titleText, titleColor}) => {
	const frame = useCurrentFrame();
	const {durationInFrames, fps} = useVideoConfig();

	const opacity = interpolate(
		frame,
		[0, 20, durationInFrames - 10, durationInFrames],
		[0, 1, 1, 0],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		},
	);

	const scale = interpolate(frame, [0, 20], [0.8, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				flex: 1,
				textAlign: 'center',
				fontSize: 80,
				background: 'linear-gradient(to bottom, #87ceeb, #98fb98)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<div
				style={{
					color: titleColor,
					opacity,
					transform: `scale(${scale})`,
				}}
			>
				{titleText}
			</div>
		</div>
	);
};