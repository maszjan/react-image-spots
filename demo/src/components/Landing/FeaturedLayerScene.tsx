import { useState } from "react";
import { CodeBlock } from "../CodeBlock";
import { LayerSceneDemo } from "../Docs/LayerSceneDemo";

const layerSceneCode = `import { LayerScene, SpotsEditProvider } from 'react-image-spots'
import type { LayerDef } from 'react-image-spots'

const layers: LayerDef[] = [
  {
    id: 'bridge',
    type: 'image',
    src: '/bridge.jpg',
    position: { x: 38, y: 52 }, // %
    width: 260,                  // px
    height: 150,                 // px
    rotate: -3,
    zIndex: 1,
    dropShadow: '0 14px 26px rgba(0,0,0,0.35)',
  },
  {
    id: 'pin',
    type: 'icon',
    iconName: 'MapPin',          // any lucide-react export name
    position: { x: 68, y: 28 },
    size: 34,
    color: '#3b82f6',
    zIndex: 2,
    animation: 'float',          // subtle, slow drift
  },
]

// Wrap your whole app once - SpotsEditProvider renders its own
// floating "Edit this page" toggle, flipping edit mode for every
// LayerScene underneath at the same time.
<SpotsEditProvider>
  <LayerScene layers={layers} onChange={setLayers} />
</SpotsEditProvider>`;

// The featured, promoted demo - sits before "See what you can build" rather
// than as a numbered entry in that list, since it's the newest and most
// substantial capability in the package.
export const FeaturedLayerScene = () => {
	const [tab, setTab] = useState<"demo" | "code">("demo");
	const [editMode, setEditMode] = useState(false);

	return (
		<div
			id='layer-scene'
			className='w-full max-w-4xl mx-auto mb-16 scroll-mt-24'>
			<div className='mb-5 px-5 py-4 rounded-2xl border border-blue-200/60 dark:border-blue-400/20 bg-blue-50/60 dark:bg-blue-500/[0.06]'>
				<div className='text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1'>
					Newest feature
				</div>
				<p className='text-sm text-slate-600 dark:text-white/50'>
					<code className='text-blue-600 dark:text-blue-400 bg-blue-100/60 dark:bg-blue-500/10 px-1 py-0.5 rounded text-xs'>
						LayerScene
					</code>{" "}
					composites independent image + icon layers - drag, resize, rotate, and
					animate each one. No single background image required.
				</p>
			</div>

			<div className='flex items-start justify-between mb-4'>
				<div>
					<h3 className='text-lg font-bold text-slate-900 dark:text-white mb-1'>
						Layer Scene
					</h3>
					<p className='text-sm text-slate-500 dark:text-white/40 max-w-lg'>
						Composite independent image + icon layers - no single background
						required. Animated icons (float/pulse/spin/sway), full visual edit
						mode.
					</p>
				</div>
				<div className='shrink-0 ml-6 flex items-center gap-2'>
					{tab === "demo" && (
						<button
							onClick={() => setEditMode((m) => !m)}
							className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
								editMode
									? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
									: "bg-blue-600 text-white hover:bg-blue-700"
							}`}>
							{editMode ? "✓ Editing" : "✎ Edit this example"}
						</button>
					)}
					<button
						onClick={() => setTab((t) => (t === "demo" ? "code" : "demo"))}
						className='px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/20 transition-all cursor-pointer'>
						{tab === "demo" ? "View code" : "View demo"}
					</button>
				</div>
			</div>
			<div
				className={`rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm ${tab === "demo" ? "overflow-visible" : "overflow-hidden"}`}>
				{tab === "demo" ? (
					<LayerSceneDemo mode={editMode ? "edit" : "preview"} />
				) : (
					<CodeBlock code={layerSceneCode} />
				)}
			</div>
		</div>
	);
};
