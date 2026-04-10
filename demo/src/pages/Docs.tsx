import { useState } from "react";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { Sidebar } from "../components/Docs/Sidebar";
import { DocSection } from "../components/Docs/DocSection";
import { ApiTable } from "../components/Docs/ApiTable";
import { CodeBlock } from "../components/CodeBlock";
import { navigate } from "../App";
import type { PageProps } from "../App";

function Code({ children }: { children: React.ReactNode }) {
	return (
		<code className='text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-1.5 py-0.5 rounded text-[13px] font-mono'>
			{children}
		</code>
	);
}

const CODE = {
	install: `npm install react-image-spots`,

	editor: `<ImageSpotMap
  mode="edit"
  src="/my-photo.jpg"
  onSpotPlace={(pos, index) => {
    console.log(\`#\${index}\`, pos)
    // pos = { x: 32.5, y: 41.2 }
  }}
/>

// Clipboard contains: { x: 32.5, y: 41.2 }
// Paste into your SpotDef:
// position: { x: 32.5, y: 41.2 }`,

	map: `import { ImageSpotMap } from 'react-image-spots'
import type { SpotDef } from 'react-image-spots'

const spots: SpotDef[] = [
  {
    id: 'kitchen',
    position: { x: 32.5, y: 41.2 }, // % — responsive!
    size: { w: 5, h: 5 },
    render: ({ isHovered, onMouseEnter, onMouseLeave, onClick }) => (
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
        className="w-full h-full rounded-full bg-white border-2
                   border-blue-500 hover:bg-blue-500 transition-all"
      >
        {isHovered && <Tooltip>Kitchen</Tooltip>}
      </div>
    ),
  },
]

// On hover — other spots fade out automatically
<ImageSpotMap src="/floor-plan.jpg" spots={spots} />`,

	swap: `// Add hoverSrc or activeSrc to any SpotDef
{
  id: 'room-a',
  position: { x: 40, y: 50 },
  size: { w: 6, h: 6 },
  hoverSrc: '/room-hover.jpg',   // swap image on hover
  activeSrc: '/room-click.jpg',  // swap image on click
  render: (props) => <MySpot {...props} />,
}`,

	animations: `// Global animation on ImageSpotMap — applies to all spots
<ImageSpotMap
  src="/map.jpg"
  spots={spots}
  swapAnimation="zoom"
/>

// Per-spot animation — overrides global
const spots: SpotDef[] = [
  {
    id: 'bridge',
    position: { x: 28, y: 52 },
    hoverSrc: '/bridge.jpg',
    swapAnimation: 'glitch',   // this spot uses glitch
    render: (props) => <MySpot {...props} />,
  },
  {
    id: 'slums',
    position: { x: 48, y: 70 },
    hoverSrc: '/slums.jpg',
    swapAnimation: 'blur',     // this spot uses blur
    render: (props) => <MySpot {...props} />,
  },
]

// Available presets:
// 'fade' | 'blur' | 'zoom' | 'zoom-out'
// 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right'
// 'flip' | 'glitch' | 'none'

// Custom animation — your own CSS keyframes:
<ImageSpotMap
  src="/map.jpg"
  spots={spots}
  swapAnimation={{
    enter: "my-enter-anim 400ms ease forwards",
    leave: "my-leave-anim 400ms ease forwards", // optional
    duration: 400,
  }}
/>`,

	chain: `import { SceneChain } from 'react-image-spots'
import type { SceneDef } from 'react-image-spots'

const scenes: Record<string, SceneDef> = {
  world: {
    src: '/world-map.jpg',
    spots: [
      {
        id: 'castle',
        position: { x: 45, y: 35 },
        size: { w: 6, h: 6 },
        render: ({ onMouseEnter, onMouseLeave, onClick, goTo }) => (
          <button
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={(e) => { onClick(e); goTo('castle') }}
            className="w-full h-full rounded-full border-2
                       border-blue-500 bg-white hover:bg-blue-500"
          />
        ),
      },
    ],
  },
  castle: { src: '/castle.jpg', spots: [] },
}

// Custom back button — full control
<SceneChain
  scenes={scenes}
  initialScene="world"
  transition="fade"
  showBreadcrumb={false}
  renderBackButton={({ goBack }) => (
    <button
      onClick={goBack}
      className="absolute top-4 left-4 px-4 py-2 bg-black/50
                 text-white rounded-lg backdrop-blur"
    >
      ← Back
    </button>
  )}
/>`,

	renderProps: `interface SpotRenderProps {
  isHovered: boolean
  isActive: boolean
  onMouseEnter: (e: MouseEvent) => void
  onMouseLeave: (e: MouseEvent) => void
  onClick: (e: MouseEvent) => void
  goTo: (sceneId: string) => void  // SceneChain only
  goBack: () => void               // SceneChain only
  canGoBack: boolean               // SceneChain only
}`,
};

export const Docs = ({ onThemeToggle, theme }: PageProps) => {
	const [activeSection, setActiveSection] = useState("install");

	const scrollTo = (id: string) => {
		setActiveSection(id);
		document
			.getElementById(id)
			?.scrollIntoView({ behavior: "smooth", block: "start" });
	};

	return (
		<>
			<Nav active='docs' theme={theme} onThemeToggle={onThemeToggle} />
			<div className='max-w-5xl mx-auto px-6 pt-24 pb-32 flex gap-12'>
				<Sidebar activeSection={activeSection} onSectionClick={scrollTo} />

				<main className='flex-1 min-w-0'>
					<h1 className='text-4xl font-bold text-slate-900 dark:text-white mb-2'>
						Documentation
					</h1>
					<p className='text-slate-500 dark:text-white/40 text-lg mb-12'>
						Everything you need to add interactive spots to your images.
					</p>

					<DocSection
						id='install'
						title='Installation'
						code={CODE.install}
						language='bash'>
						<p className='mt-3 text-sm text-slate-500 dark:text-white/40'>
							Requires React ≥ 17. No other runtime dependencies.
						</p>
					</DocSection>

					<DocSection
						id='editor'
						title='Collecting Spot Positions'
						description={
							<>
								Switch to <Code>mode="edit"</Code> to collect spot positions.
								Click anywhere on the image — the position is instantly copied
								to your clipboard. Paste it into your <Code>SpotDef</Code>. No
								separate component needed.
							</>
						}
						code={CODE.editor}
						cta={{
							label: "See examples",
							onClick: () => navigate("home", "examples"),
						}}
					/>

					<DocSection
						id='map'
						title='Image Spot Map'
						description={
							<>
								<Code>ImageSpotMap</Code> renders your image with interactive
								spots. Positions are in <Code>%</Code> so they scale
								responsively with any container size. When hovering a spot, all
								others fade out automatically.
							</>
						}
						code={CODE.map}
						cta={{
							label: "See examples",
							onClick: () => navigate("home", "examples"),
						}}
					/>

					<DocSection
						id='swap'
						title='Image Swap'
						description={
							<>
								Add <Code>hoverSrc</Code> or <Code>activeSrc</Code> to any spot
								— the main image crossfades automatically on hover or click.
							</>
						}
						code={CODE.swap}
					/>

					<DocSection
						id='animations'
						title='Swap Animations'
						description={
							<>
								Choose from 10 built-in animation presets or provide your own
								CSS keyframes. Set globally on <Code>ImageSpotMap</Code> or
								per-spot on <Code>SpotDef</Code> — per-spot overrides global.
							</>
						}
						code={CODE.animations}
					/>

					<DocSection
						id='chain'
						title='Scene Chain'
						description={
							<>
								Navigate between multiple images with smooth transitions. Use{" "}
								<Code>goTo(sceneId)</Code> in your render function. Full control
								over back button via <Code>renderBackButton</Code>.
							</>
						}
						code={CODE.chain}
						cta={{
							label: "See examples",
							onClick: () => navigate("home", "examples"),
						}}
					/>

					<section id='api' className='scroll-mt-24 mb-14'>
						<h2 className='text-xl font-bold text-slate-900 dark:text-white mb-6'>
							API Reference
						</h2>

						<div className='mb-8'>
							<h3 className='text-base font-semibold text-slate-700 dark:text-white/80 mb-3'>
								<Code>SpotRenderProps</Code>
							</h3>
							<CodeBlock code={CODE.renderProps} language='ts' />
						</div>

						<ApiTable
							componentName='ImageSpotMap'
							props={[
								{
									name: "src",
									type: "string",
									required: true,
									desc: "Image URL or imported asset",
								},
								{
									name: "mode",
									type: "'preview' | 'edit'",
									desc: "preview — interactive spots, edit — collect positions. Default: 'preview'",
								},
								{
									name: "spots",
									type: "SpotDef[]",
									desc: "Spot definitions (preview mode)",
								},
								{
									name: "onSpotPlace",
									type: "(pos, index) => void",
									desc: "edit mode: fired on click with position + index",
								},
								{
									name: "enableImageSwap",
									type: "boolean",
									desc: "Enable image swap on hover/click. Default: true",
								},
								{
									name: "swapDuration",
									type: "number",
									desc: "Swap duration ms. Default: 400",
								},
								{
									name: "swapAnimation",
									type: "SwapAnimationPreset | SwapAnimationCustom",
									desc: "Global swap animation for all spots. Default: 'fade'",
								},
								{
									name: "onSpotHover",
									type: "(spot) => void",
									desc: "Fired on mouse enter",
								},
								{
									name: "onSpotClick",
									type: "(spot) => void",
									desc: "Fired on click",
								},
								{
									name: "onSpotLeave",
									type: "(spot) => void",
									desc: "Fired on mouse leave",
								},
							]}
						/>

						<ApiTable
							componentName='SceneChain'
							props={[
								{
									name: "scenes",
									type: "Record<string, SceneDef>",
									required: true,
									desc: "Map of sceneId → scene definition",
								},
								{
									name: "initialScene",
									type: "string",
									required: true,
									desc: "Starting scene ID",
								},
								{
									name: "transition",
									type: "'fade' | 'none'",
									desc: "Scene transition animation. Default: 'fade'",
								},
								{
									name: "transitionDuration",
									type: "number",
									desc: "Transition duration ms. Default: 350",
								},
								{
									name: "swapAnimation",
									type: "SwapAnimationPreset | SwapAnimationCustom",
									desc: "Swap animation for all spots in all scenes. Default: 'fade'",
								},
								{
									name: "renderBackButton",
									type: "({ goBack, canGoBack, history }) => ReactNode",
									desc: "Custom back button — full control",
								},
								{
									name: "showBackButton",
									type: "boolean",
									desc: "Show built-in back button. Default: true",
								},
								{
									name: "backButtonLabel",
									type: "string",
									desc: "Built-in back button label. Default: '← Back'",
								},
								{
									name: "showBreadcrumb",
									type: "boolean",
									desc: "Show scene breadcrumb trail. Default: true",
								},
								{
									name: "onSceneChange",
									type: "(id, scene) => void",
									desc: "Fired on scene change",
								},
								{
									name: "onSpotClick",
									type: "(spot, sceneId) => void",
									desc: "Fired when spot is clicked",
								},
							]}
						/>

						<ApiTable
							componentName='SpotDef'
							props={[
								{
									name: "id",
									type: "string",
									required: true,
									desc: "Unique identifier",
								},
								{
									name: "position",
									type: "{ x: number, y: number }",
									required: true,
									desc: "Position in % (0–100)",
								},
								{
									name: "size",
									type: "{ w: number, h: number }",
									desc: "Hitbox size in %. Default: { w: 5, h: 5 }",
								},
								{
									name: "render",
									type: "(props: SpotRenderProps) => ReactNode",
									required: true,
									desc: "Your render function — full control",
								},
								{
									name: "hoverSrc",
									type: "string",
									desc: "Image URL to swap on hover",
								},
								{
									name: "activeSrc",
									type: "string",
									desc: "Image URL to swap on click",
								},
								{
									name: "swapAnimation",
									type: "SwapAnimationPreset | SwapAnimationCustom",
									desc: "Per-spot animation — overrides global swapAnimation",
								},
							]}
						/>

						<ApiTable
							componentName='SwapAnimationCustom'
							props={[
								{
									name: "enter",
									type: "string",
									required: true,
									desc: "CSS animation string for incoming image e.g. 'my-anim 400ms ease forwards'",
								},
								{
									name: "leave",
									type: "string",
									desc: "CSS animation string for outgoing image (optional)",
								},
								{
									name: "duration",
									type: "number",
									desc: "Duration ms — used to time the swap. Default: 400",
								},
							]}
						/>
					</section>
				</main>
			</div>
			<Footer />
		</>
	);
};
