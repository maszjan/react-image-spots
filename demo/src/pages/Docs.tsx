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
    position: { x: 32.5, y: 41.2 }, // % - responsive!
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

// On hover - other spots fade out automatically
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

	animations: `// Global animation on ImageSpotMap - applies to all spots
<ImageSpotMap
  src="/map.jpg"
  spots={spots}
  swapAnimation="zoom"
/>

// Per-spot animation - overrides global
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

// Custom animation - your own CSS keyframes:
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

// Custom back button - full control
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

	layerSceneQuickstart: `npm install react-image-spots lucide-react

import { LayerScene, SpotsEditProvider } from 'react-image-spots'
import type { LayerDef } from 'react-image-spots'

const layers: LayerDef[] = [
  {
    id: 'mascot',
    type: 'image',
    src: '/mascot.png',
    position: { x: 38, y: 52 }, // %
    width: 260,                  // px
    height: 150,                 // px
    rotate: -3,
    zIndex: 1,
  },
  {
    id: 'pin',
    type: 'icon',
    iconName: 'MapPin',          // any lucide-react export name
    position: { x: 68, y: 28 },
    size: 34,                    // px
    rotate: 0,
    color: '#3b82f6',
    zIndex: 2,
    animation: 'float',
  },
]

// Wrap your whole app (or a page) once. SpotsEditProvider renders its
// own floating "Edit this page" toggle - click it to enter edit mode
// for every LayerScene underneath at the same time. No manual switch,
// no threading a mode prop through each component.
<SpotsEditProvider>
  <LayerScene layers={layers} onChange={console.log} />
</SpotsEditProvider>`,

	layerSceneEdit: `<LayerScene
  layers={layers}
  mode="edit"                 // overrides SpotsEditProvider's global toggle
  onChange={(next) => setLayers(next)}
  onExport={(next) => saveDraft(next)}   // clipboard copy + this callback
  autoExportOnChange           // also fires onExport ~500ms after any change
/>

// Edit mode adds a toolbar card ABOVE the scene box (never glued to
// its edge): add icon, bring-to-front, send-to-back, duplicate,
// delete, export - icon buttons (lucide-react), reorder/duplicate/
// delete disabled until a layer is selected. Plus a resize handle
// and a rotate handle on the selected layer, a layer panel beside
// the scene box, and a live x/y/w/h/rotate readout below it. The
// scene box itself renders only the composed layers - zero editor
// chrome inside or attached to it.`,

	layerSceneResponsive: `{
  id: 'mascot',
  type: 'image',
  src: '/mascot.png',
  position: { x: 50, y: 50 },
  width: 260,
  height: 150,
  responsive: {
    mobile: { position: { x: 50, y: 35 }, width: 160, height: 92 },
    tablet: { width: 210, height: 121 },
    // desktop: falls back to the base position/width/height above
  },
}

// LayerScene resolves its own breakpoint from its rendered width - not
// the browser window's - so it reacts correctly to anything that
// constrains its width, real window resizing included.
// Default thresholds: mobile <= 640px, tablet <= 1024px, else desktop.
<LayerScene
  layers={layers}
  breakpoints={{ mobile: 480, tablet: 900 }} // optional, configurable
/>

// SpotsEditProvider's floating Mobile/Tablet buttons (shown once
// editing) simulate a device viewport by resizing the WHOLE page -
// not just one component - to that width, so every LayerScene on the
// page picks up the matching breakpoint automatically. Dragging a
// layer while "Mobile" is simulated writes to responsive.mobile.`,

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
								Click anywhere on the image - the position is instantly copied
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
								- the main image crossfades automatically on hover or click.
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
								per-spot on <Code>SpotDef</Code> - per-spot overrides global.
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

					<DocSection
						id='layer-scene'
						title='Layer Scene'
						description={
							<>
								<Code>LayerScene</Code> composites several independent image
								and/or icon layers - no single "background" required, unlike{" "}
								<Code>ImageSpotMap</Code>. Each layer is positioned, sized,
								rotated, and z-ordered on its own. Icon layers render any{" "}
								<Code>lucide-react</Code> icon by name - install it alongside
								this package to use them (it's an optional peer dependency;
								image-only scenes work without it, and icon layers show a
								placeholder instead of crashing if it's missing).
							</>
						}
						code={CODE.layerSceneQuickstart}
						cta={{
							label: "See it running live",
							onClick: () => navigate("home", "layer-scene"),
						}}>
						<div className='mt-8'>
							<h3 className='text-base font-semibold text-slate-700 dark:text-white/80 mb-2'>
								Edit mode
							</h3>
							<p className='text-sm text-slate-500 dark:text-white/50 mb-4 leading-relaxed'>
								<Code>SpotsEditProvider</Code> wraps your whole app once and
								renders its own floating toggle - click it to flip edit mode for
								every <Code>LayerScene</Code> on the page at the same time, no
								manual switch or per-component wiring needed (an explicit{" "}
								<Code>mode</Code> prop on an individual <Code>LayerScene</Code>{" "}
								still overrides it). Every selected layer gets a fully visible
								toolbar and handles - nothing is hidden until you find it - plus
								a side panel listing every layer, even ones hidden behind
								another.
							</p>
							<CodeBlock code={CODE.layerSceneEdit} language='tsx' />
						</div>

						<div className='mt-8'>
							<h3 className='text-base font-semibold text-slate-700 dark:text-white/80 mb-2'>
								Responsive layers
							</h3>
							<p className='text-sm text-slate-500 dark:text-white/50 mb-4 leading-relaxed'>
								Any layer can override its <Code>position</Code>,{" "}
								<Code>width</Code>/<Code>height</Code>/<Code>size</Code>, and{" "}
								<Code>rotate</Code> per breakpoint via{" "}
								<Code>responsive.mobile</Code> / <Code>responsive.tablet</Code>{" "}
								/ <Code>responsive.desktop</Code>. Missing fields fall back to
								the base values.
							</p>
							<CodeBlock code={CODE.layerSceneResponsive} language='tsx' />
						</div>
					</DocSection>

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
									desc: "preview - interactive spots, edit - collect positions. Default: 'preview'",
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
									desc: "Custom back button - full control",
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
									desc: "Your render function - full control",
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
									desc: "Per-spot animation - overrides global swapAnimation",
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
									desc: "Duration ms - used to time the swap. Default: 400",
								},
							]}
						/>

						<ApiTable
							componentName='LayerScene'
							props={[
								{
									name: "layers",
									type: "LayerDef[]",
									required: true,
									desc: "Image and/or icon layer definitions",
								},
								{
									name: "mode",
									type: "'preview' | 'edit'",
									desc: "Overrides SpotsEditProvider's global toggle. Default: 'preview' (or the provider)",
								},
								{
									name: "onChange",
									type: "(layers: LayerDef[]) => void",
									desc: "Fired after any edit-mode change (move/resize/rotate/reorder/add/delete)",
								},
								{
									name: "onExport",
									type: "(layers: LayerDef[]) => void",
									desc: "Fired by the Export button (+ clipboard copy), and by autoExportOnChange",
								},
								{
									name: "autoExportOnChange",
									type: "boolean",
									desc: "Auto-fire onExport ~500ms after a change settles. Default: false",
								},
								{
									name: "breakpoints",
									type: "{ mobile: number, tablet: number }",
									desc: "Breakpoint width thresholds (px), resolved from this LayerScene's own rendered width. Default: { mobile: 640, tablet: 1024 }",
								},
								{
									name: "showChrome",
									type: "boolean",
									desc: "Show the top toolbar + side layer panel. Default: true - set false when stacking with another LayerScene in the same viewport (SpotsEditProvider's backgroundLayers canvas does this internally) so their chrome doesn't collide",
								},
							]}
						/>

						<ApiTable
							componentName='SpotsEditProvider'
							props={[
								{
									name: "children",
									type: "ReactNode",
									required: true,
									desc: "Your whole app or page - wrap it once",
								},
								{
									name: "defaultEditMode",
									type: "boolean",
									desc: "Initial edit mode when uncontrolled. Default: false",
								},
								{
									name: "editMode",
									type: "boolean",
									desc: "Controlled edit mode - omit to let the provider manage its own state via the built-in toggle",
								},
								{
									name: "onEditModeChange",
									type: "(editMode: boolean) => void",
									desc: "Fired whenever edit mode changes (toggle click, or controlled prop)",
								},
								{
									name: "showToggle",
									type: "boolean",
									desc: "Show the built-in floating toggle + Mobile/Tablet/Desktop switcher. Default: true",
								},
								{
									name: "togglePosition",
									type: "'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'",
									desc: "Corner for the floating toggle. Default: 'bottom-right'",
								},
								{
									name: "frameWidths",
									type: "{ mobile: number, tablet: number }",
									desc: "Simulated device widths (px) for the Mobile/Tablet preview frame that wraps children. Default: { mobile: 375, tablet: 768 }",
								},
								{
									name: "backgroundLayers",
									type: "LayerDef[]",
									desc: "Page-wide decorative image/icon layers, positioned in % over the full height of children - not confined to any single LayerScene's box",
								},
								{
									name: "onBackgroundLayersChange",
									type: "(layers: LayerDef[]) => void",
									desc: "Fired after any edit to backgroundLayers",
								},
								{
									name: "onBackgroundExport",
									type: "(layers: LayerDef[]) => void",
									desc: 'Fired by the global panel\'s "Export background layers" button, and by autoExportBackgroundOnChange',
								},
								{
									name: "autoExportBackgroundOnChange",
									type: "boolean",
									desc: "Auto-fire onBackgroundExport ~500ms after a change settles. Default: false",
								},
							]}
						/>

						<ApiTable
							componentName='ImageLayerDef'
							props={[
								{
									name: "id",
									type: "string",
									required: true,
									desc: "Unique identifier",
								},
								{
									name: "type",
									type: "'image'",
									required: true,
									desc: "Discriminant",
								},
								{
									name: "src",
									type: "string",
									required: true,
									desc: "Image URL",
								},
								{ name: "alt", type: "string", desc: "Alt text" },
								{
									name: "position",
									type: "{ x: number, y: number }",
									required: true,
									desc: "Position in % (0–100), from the layer's center",
								},
								{
									name: "width",
									type: "number",
									required: true,
									desc: "Width in px",
								},
								{
									name: "height",
									type: "number",
									required: true,
									desc: "Height in px",
								},
								{
									name: "rotate",
									type: "number",
									desc: "Rotation in degrees. Default: 0",
								},
								{
									name: "zIndex",
									type: "number",
									desc: "Stacking order. Default: 0",
								},
								{
									name: "dropShadow",
									type: "string",
									desc: "CSS drop-shadow() filter value",
								},
								{
									name: "animation",
									type: "LayerAnimation",
									desc: "Preset or custom keyframes. Default: 'none'",
								},
								{
									name: "responsive",
									type: "{ mobile?, tablet?, desktop?: {...} }",
									desc: "Per-breakpoint overrides for position/width/height/rotate",
								},
							]}
						/>

						<ApiTable
							componentName='IconLayerDef'
							props={[
								{
									name: "id",
									type: "string",
									required: true,
									desc: "Unique identifier",
								},
								{
									name: "type",
									type: "'icon'",
									required: true,
									desc: "Discriminant",
								},
								{
									name: "iconName",
									type: "string",
									required: true,
									desc: "Any lucide-react export name, e.g. 'Coffee', 'MapPin'",
								},
								{
									name: "position",
									type: "{ x: number, y: number }",
									required: true,
									desc: "Position in % (0–100), from the layer's center",
								},
								{
									name: "size",
									type: "number",
									required: true,
									desc: "Icon box size in px",
								},
								{
									name: "rotate",
									type: "number",
									desc: "Rotation in degrees. Default: 0",
								},
								{ name: "color", type: "string", desc: "Icon color" },
								{
									name: "zIndex",
									type: "number",
									desc: "Stacking order. Default: 0",
								},
								{
									name: "animation",
									type: "LayerAnimation",
									desc: "Preset or custom keyframes. Default: 'none'",
								},
								{
									name: "responsive",
									type: "{ mobile?, tablet?, desktop?: {...} }",
									desc: "Per-breakpoint overrides for position/size/rotate",
								},
							]}
						/>

						<div className='mb-8'>
							<h3 className='text-base font-semibold text-slate-700 dark:text-white/80 mb-3'>
								<Code>LayerAnimation</Code> presets
							</h3>
							<div className='rounded-xl border border-slate-200 dark:border-white/8 overflow-hidden'>
								<table className='w-full text-sm'>
									<thead>
										<tr className='border-b border-slate-200 dark:border-white/8 bg-slate-50 dark:bg-white/3'>
											<th className='text-left px-4 py-2.5 text-slate-500 dark:text-white/40 font-medium text-xs uppercase tracking-wider'>
												Preset
											</th>
											<th className='text-left px-4 py-2.5 text-slate-500 dark:text-white/40 font-medium text-xs uppercase tracking-wider'>
												Effect
											</th>
										</tr>
									</thead>
									<tbody className='text-xs text-slate-500 dark:text-white/40'>
										{[
											["none", "No animation (default)"],
											[
												"float",
												"Subtle, slow translateY drift - for decorative icons/mascots",
											],
											["pulse", "Slow opacity pulse"],
											["spin", "Continuous 360° rotation"],
											["sway", "Gentle rotation back and forth"],
										].map(([name, desc], i, arr) => (
											<tr
												key={name}
												className={
													i < arr.length - 1
														? "border-b border-slate-100 dark:border-white/5"
														: ""
												}>
												<td className='px-4 py-3'>
													<code className='text-blue-600 dark:text-blue-300 text-xs font-mono'>
														{name}
													</code>
												</td>
												<td className='px-4 py-3'>{desc}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
							<p className='mt-2 text-xs text-slate-400 dark:text-white/30'>
								Custom:{" "}
								<code className='font-mono'>
									{
										"{ keyframes: 'my-anim 3s ease-in-out infinite', duration?: number }"
									}
								</code>
							</p>
						</div>
					</section>
				</main>
			</div>
			<Footer />
		</>
	);
};
