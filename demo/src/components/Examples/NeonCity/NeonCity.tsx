import { SceneChain } from "react-image-spots";
import type { SceneDef } from "react-image-spots";
import { NeonSpot } from "./NeonSpot";
import { NeonBackButton } from "./NeonBackButton";

const COLORS = {
	bridge: "#00fff0",
	corporate: "#ff2d78",
	slums: "#f5a623",
};

const scenes: Record<string, SceneDef> = {
	map: {
		src: "/examples/neon_city/map.jpg",
		spots: [
			{
				id: "bridge",
				position: { x: 28, y: 52 },
				size: { w: 7, h: 7 },
				swapAnimation: "glitch",
				render: (p) => (
					<NeonSpot
						{...p}
						label='The Bridge'
						sublabel='SECTOR 7 — TRANSIT HUB'
						color={COLORS.bridge}
						previewSrc='/examples/neon_city/bridge.jpg'
						nextScene='bridge'
					/>
				),
			},
			{
				id: "corporate",
				position: { x: 62, y: 35 },
				size: { w: 7, h: 7 },
				swapAnimation: "glitch",
				render: (p) => (
					<NeonSpot
						{...p}
						label='Corp Downtown'
						sublabel='MEGACORP DISTRICT'
						color={COLORS.corporate}
						previewSrc='/examples/neon_city/corporate_downtown.jpg'
						nextScene='corporate'
					/>
				),
			},
			{
				id: "slums",
				position: { x: 48, y: 70 },
				size: { w: 7, h: 7 },
				swapAnimation: "glitch",
				render: (p) => (
					<NeonSpot
						{...p}
						label='The Slums'
						sublabel='LOWER DISTRICT — HIGH RISK'
						color={COLORS.slums}
						previewSrc='/examples/neon_city/slums.jpg'
						nextScene='slums'
					/>
				),
			},
		],
	},
	bridge: { src: "/examples/neon_city/bridge.jpg", spots: [] },
	corporate: { src: "/examples/neon_city/corporate_downtown.jpg", spots: [] },
	slums: { src: "/examples/neon_city/slums.jpg", spots: [] },
};

export const NeonCity = () => (
	<div className='aspect-video w-full relative'>
		<div
			style={{
				position: "absolute",
				inset: 0,
				zIndex: 5,
				background:
					"repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)",
				pointerEvents: "none",
				borderRadius: "inherit",
			}}
		/>
		<SceneChain
			scenes={scenes}
			initialScene='map'
			transition='fade'
			transitionDuration={400}
			showBreadcrumb={false}
			renderBackButton={({ goBack }) => (
				<NeonBackButton goBack={goBack} label='← BACK TO MAP' color='#00fff0' />
			)}
		/>
	</div>
);
