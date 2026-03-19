import {Composition} from 'remotion';
import {MyComposition} from './Composition';
import {GTMEducationVideo} from './GTMEducationVideo';

export const RemotionRoot = () => {
	return (
		<>
			<Composition
				id="GTMFoundations"
				component={GTMEducationVideo}
				durationInFrames={9000} // 5 minutes at 30fps
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{}}
			/>
			<Composition
				id="MyComp"
				component={MyComposition}
				durationInFrames={150}
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{
					titleText: 'Welcome to Remotion',
					titleColor: '#000000',
				}}
			/>
		</>
	);
};