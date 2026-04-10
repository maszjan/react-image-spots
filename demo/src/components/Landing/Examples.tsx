import { useState } from "react";
import { ImageSpotMap } from "react-image-spots";
import type { SpotDef } from "react-image-spots";
import { CodeBlock } from "../CodeBlock";
import { NeonCity } from "../Examples/NeonCity/NeonCity";

const editorCode = `<ImageSpotMap
  mode="edit"
  src="/neon_city/map.jpg"
  onSpotPlace={(pos, index) => {
    console.log(\`#\${index}\`, pos)
  }}
/>

// Then paste into your SpotDef:
// {
//   id: 'bridge',
//   position: { x: 28, y: 52 },
//   size: { w: 7, h: 7 },
//   render: (props) => <NeonSpot {...props} />
// }`;

const mapOnlySpots: SpotDef[] = [
	{
		id: "bridge",
		position: { x: 28, y: 52 },
		size: { w: 7, h: 7 },
		hoverSrc: "/examples/neon_city/bridge.jpg",
		swapAnimation: "glitch",
		render: ({ onMouseEnter, onMouseLeave, isHovered }) => (
			<div
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
				style={{
					width: "100%",
					height: "100%",
					position: "relative",
					cursor: "pointer",
				}}>
				<div
					style={{
						position: "absolute",
						inset: 0,
						borderRadius: "50%",
						border: "2px solid #00fff0",
						background: isHovered
							? "rgba(0,255,240,0.2)"
							: "rgba(0,255,240,0.08)",
						boxShadow: isHovered
							? "0 0 16px #00fff0, inset 0 0 16px rgba(0,255,240,0.1)"
							: "0 0 8px rgba(0,255,240,0.4)",
						transition: "all 0.3s ease",
					}}
				/>
				<div
					style={{
						position: "absolute",
						inset: "35%",
						borderRadius: "50%",
						background: "#00fff0",
						boxShadow: "0 0 8px 2px #00fff0",
						transition: "all 0.3s ease",
						transform: isHovered ? "scale(1.4)" : "scale(1)",
					}}
				/>
			</div>
		),
	},
	{
		id: "corporate",
		position: { x: 62, y: 35 },
		size: { w: 7, h: 7 },
		hoverSrc: "/examples/neon_city/corporate_downtown.jpg",
		swapAnimation: "glitch",
		render: ({ onMouseEnter, onMouseLeave, isHovered }) => (
			<div
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
				style={{
					width: "100%",
					height: "100%",
					position: "relative",
					cursor: "pointer",
				}}>
				<div
					style={{
						position: "absolute",
						inset: 0,
						borderRadius: "50%",
						border: "2px solid #ff2d78",
						background: isHovered
							? "rgba(255,45,120,0.2)"
							: "rgba(255,45,120,0.08)",
						boxShadow: isHovered
							? "0 0 16px #ff2d78, inset 0 0 16px rgba(255,45,120,0.1)"
							: "0 0 8px rgba(255,45,120,0.4)",
						transition: "all 0.3s ease",
					}}
				/>
				<div
					style={{
						position: "absolute",
						inset: "35%",
						borderRadius: "50%",
						background: "#ff2d78",
						boxShadow: "0 0 8px 2px #ff2d78",
						transition: "all 0.3s ease",
						transform: isHovered ? "scale(1.4)" : "scale(1)",
					}}
				/>
			</div>
		),
	},
	{
		id: "slums",
		position: { x: 48, y: 70 },
		size: { w: 7, h: 7 },
		hoverSrc: "/examples/neon_city/slums.jpg",
		swapAnimation: "glitch",
		render: ({ onMouseEnter, onMouseLeave, isHovered }) => (
			<div
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
				style={{
					width: "100%",
					height: "100%",
					position: "relative",
					cursor: "pointer",
				}}>
				<div
					style={{
						position: "absolute",
						inset: 0,
						borderRadius: "50%",
						border: "2px solid #f5a623",
						background: isHovered
							? "rgba(245,166,35,0.2)"
							: "rgba(245,166,35,0.08)",
						boxShadow: isHovered
							? "0 0 16px #f5a623, inset 0 0 16px rgba(245,166,35,0.1)"
							: "0 0 8px rgba(245,166,35,0.4)",
						transition: "all 0.3s ease",
					}}
				/>
				<div
					style={{
						position: "absolute",
						inset: "35%",
						borderRadius: "50%",
						background: "#f5a623",
						boxShadow: "0 0 8px 2px #f5a623",
						transition: "all 0.3s ease",
						transform: isHovered ? "scale(1.4)" : "scale(1)",
					}}
				/>
			</div>
		),
	},
];

const mapCode = `import { ImageSpotMap } from 'react-image-spots'
import type { SpotDef } from 'react-image-spots'

const spots: SpotDef[] = [
  {
    id: 'bridge',
    position: { x: 28, y: 52 },
    size: { w: 7, h: 7 },
    hoverSrc: '/bridge.jpg',
    swapAnimation: 'glitch',
    render: ({ isHovered, onMouseEnter, onMouseLeave }) => (
      <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
        style={{ width: '100%', height: '100%', position: 'relative', cursor: 'pointer' }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%',
          border: '2px solid #00fff0',
          background: isHovered ? 'rgba(0,255,240,0.2)' : 'rgba(0,255,240,0.08)',
          boxShadow: '0 0 8px rgba(0,255,240,0.4)', transition: 'all 0.3s' }} />
        <div style={{ position: 'absolute', inset: '35%', borderRadius: '50%',
          background: '#00fff0', boxShadow: '0 0 8px 2px #00fff0',
          transform: isHovered ? 'scale(1.4)' : 'scale(1)', transition: 'all 0.3s' }} />
      </div>
    ),
  },
]

<ImageSpotMap
  src="/map.jpg"
  spots={spots}
  hideHoveredSpot={true}
/>`;

const chainCode = `import { SceneChain } from 'react-image-spots'
import type { SceneDef } from 'react-image-spots'

const scenes: Record<string, SceneDef> = {
  map: {
    src: '/neon_city/map.jpg',
    spots: [
      {
        id: 'bridge',
        position: { x: 28, y: 52 },
        size: { w: 7, h: 7 },
        render: ({ onMouseEnter, onMouseLeave, onClick, goTo, isHovered }) => (
          <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
            onClick={(e) => { onClick(e); goTo('bridge') }}
            style={{ width: '100%', height: '100%', cursor: 'pointer',
              borderRadius: '50%', border: '2px solid #00fff0',
              background: isHovered ? '#00fff0' : 'transparent',
              boxShadow: isHovered ? '0 0 20px #00fff0' : 'none',
              transition: 'all 0.3s' }}
          />
        ),
      },
    ],
  },
  bridge: { src: '/neon_city/bridge.jpg', spots: [] },
}

<SceneChain
  scenes={scenes}
  initialScene="map"
  transition="fade"
  showBreadcrumb={false}
  renderBackButton={({ goBack }) => (
    <button onClick={goBack} style={{
      position: 'absolute', top: 16, left: 16, zIndex: 50,
      background: 'rgba(0,0,0,0.75)', border: '1px solid #00fff0',
      color: '#00fff0', fontFamily: 'monospace', padding: '6px 14px',
      textShadow: '0 0 8px #00fff0', cursor: 'pointer',
    }}>
      ← BACK TO MAP
    </button>
  )}
/>`;

const examples = [
	{
		id: "editor",
		label: "01",
		title: "Edit Mode",
		desc: 'Switch to mode="edit" on your actual image. Click to place markers — positions auto-copied to clipboard.',
		accentColor: "text-amber-500 dark:text-amber-400",
		demo: (
			<div className='aspect-video w-full'>
				<ImageSpotMap
					mode='edit'
					src='/examples/neon_city/map.jpg'
					alt='Neon City — Edit Mode'
				/>
			</div>
		),
		code: editorCode,
	},
	{
		id: "map",
		label: "02",
		title: "Image Spot Map",
		desc: "Hover a spot — others fade out, main image glitch-swaps. Custom neon components, per-spot animation presets.",
		accentColor: "text-cyan-500 dark:text-cyan-400",
		demo: (
			<div className='aspect-video w-full'>
				<ImageSpotMap
					src='/examples/neon_city/map.jpg'
					alt='Neon City Map'
					spots={mapOnlySpots}
					hideHoveredSpot={true}
				/>
			</div>
		),
		code: mapCode,
	},
	{
		id: "chain",
		label: "03",
		title: "Scene Chain",
		desc: "Navigate between scenes with fade transition. Custom back button, no breadcrumb — full control over UI.",
		accentColor: "text-pink-500 dark:text-pink-400",
		demo: <NeonCity />,
		code: chainCode,
	},
];

export const Examples = () => {
	const [activeTab, setActiveTab] = useState<Record<string, "demo" | "code">>({
		editor: "demo",
		map: "demo",
		chain: "demo",
	});

	const toggle = (id: string) =>
		setActiveTab((p) => ({ ...p, [id]: p[id] === "demo" ? "code" : "demo" }));

	return (
		<section id='examples' className='px-6 py-16 max-w-4xl mx-auto'>
			<div className='mb-12'>
				<h2 className='text-2xl font-bold text-slate-900 dark:text-white mb-1'>
					See what you can build
				</h2>
				<p className='text-slate-500 dark:text-white/40'>
					with Neon City example
				</p>
			</div>

			<div className='flex flex-col gap-12'>
				{examples.map(({ id, label, title, desc, accentColor, demo, code }) => (
					<div key={id} id={id} className='scroll-mt-24'>
						<div className='flex items-start justify-between mb-4'>
							<div>
								<div
									className={`text-xs font-bold uppercase tracking-wider mb-1 ${accentColor}`}>
									{label}
								</div>
								<h3 className='text-lg font-bold text-slate-900 dark:text-white mb-1'>
									{title}
								</h3>
								<p className='text-sm text-slate-500 dark:text-white/40 max-w-lg'>
									{desc}
								</p>
							</div>
							<button
								onClick={() => toggle(id)}
								className='shrink-0 ml-6 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/20 transition-all cursor-pointer'>
								{activeTab[id] === "demo" ? "View code" : "View demo"}
							</button>
						</div>
						<div
							className={`rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm ${activeTab[id] === "demo" ? "overflow-visible" : "overflow-hidden"}`}>
							{activeTab[id] === "demo" ? demo : <CodeBlock code={code} />}
						</div>
					</div>
				))}
			</div>
		</section>
	);
};
