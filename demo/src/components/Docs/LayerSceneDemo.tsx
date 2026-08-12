import { useState } from "react";
import { LayerScene } from "react-image-spots";
import type { LayerDef } from "react-image-spots";
import { asset } from "../../utils";

// Everything you drag/resize/rotate here ends up in this array - click
// Export to copy it, then paste it back in here to make it the new default.
const INITIAL_LAYERS: LayerDef[] = [
	{
		id: "char-2",
		type: "image",
		src: asset("char-2.png"),
		alt: "Character 2",
		position: { x: 62, y: 68 },
		width: 130,
		height: 230,
		rotate: 0,
		zIndex: 1,
		dropShadow: "0 14px 26px rgba(0,0,0,0.35)",
		animation: "sway",
		responsive: {
			mobile: { position: { x: 68, y: 62 }, width: 84, height: 149 },
		},
	},
	{
		id: "char-1",
		type: "image",
		src: asset("char-1.png"),
		alt: "Character 1",
		position: { x: 38, y: 72 },
		width: 150,
		height: 369,
		rotate: 0,
		zIndex: 2,
		dropShadow: "0 14px 26px rgba(0,0,0,0.35)",
		animation: "float",
		responsive: {
			mobile: { position: { x: 32, y: 66 }, width: 96, height: 236 },
		},
	},
	{
		id: "sparkle",
		type: "icon",
		iconName: "Sparkles",
		position: { x: 18, y: 20 },
		size: 26,
		rotate: 0,
		color: "#f59e0b",
		zIndex: 3,
		animation: "pulse",
	},
	{
		id: "zap",
		type: "icon",
		iconName: "Zap",
		position: { x: 82, y: 26 },
		size: 24,
		rotate: 0,
		color: "#8b5cf6",
		zIndex: 3,
		animation: "float",
	},
];

export interface LayerSceneDemoProps {
	/**
	 * Controlled by the parent's own "Edit this example" toggle (placed next
	 * to "View code"), not SpotsEditProvider's site-wide floating toggle -
	 * this one instance edits independently of the rest of the page.
	 */
	mode: "preview" | "edit";
}

export const LayerSceneDemo = ({ mode }: LayerSceneDemoProps) => {
	const [layers, setLayers] = useState<LayerDef[]>(INITIAL_LAYERS);

	return (
		<div>
			<div style={{ height: 460 }}>
				<LayerScene layers={layers} mode={mode} onChange={setLayers} />
			</div>
			<p className='mt-3 text-[11px] text-slate-400 dark:text-white/30'>
				Arrange layers, then click the toolbar's export icon to copy the config
				to your clipboard - paste it into the scene's config file (the{" "}
				<code>INITIAL_LAYERS</code> array above) in code to make your layout the
				new default.
			</p>
		</div>
	);
};
