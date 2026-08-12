# react-image-spots

Interactive image hotspots for React. Define spots in code, render anything, navigate between scenes with animations.

[![npm](https://img.shields.io/npm/v/react-image-spots)](https://npmjs.com/package/react-image-spots)
[![tests](https://github.com/maszjan/react-image-spots/actions/workflows/ci.yml/badge.svg)](https://github.com/maszjan/react-image-spots/actions/workflows/ci.yml)
[![license](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

![preview](preview.gif)

**[Live demo →](https://maszjan.github.io/react-image-spots/)**

---

## Install

```bash
npm install react-image-spots
```

Requires React 17+. No runtime dependencies.

---

## Collecting Spot Positions

Switch to `mode="edit"` during development. Click anywhere on the image - the `x/y` position is instantly copied to your clipboard.

```tsx
<ImageSpotMap
	mode='edit'
	src='/my-photo.jpg'
	onSpotPlace={(pos, index) => console.log(pos)}
	// pos = { x: 32.5, y: 41.2 }
/>
```

---

## Image Spot Map

Positions are in `%` so they scale responsively. On hover, other spots fade out automatically.

```tsx
import { ImageSpotMap } from 'react-image-spots'
import type { SpotDef } from 'react-image-spots'

const spots: SpotDef[] = [
  {
    id: 'kitchen',
    position: { x: 32.5, y: 41.2 },
    size: { w: 5, h: 5 },
    render: ({ isHovered, onMouseEnter, onMouseLeave, onClick }) => (
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: isHovered ? '#3b82f6' : 'white',
          border: '2px solid #3b82f6',
        }}
      />
    ),
  },
]

<ImageSpotMap src="/floor-plan.jpg" spots={spots} />
```

---

## Image Swap

Add `hoverSrc` or `activeSrc` to swap the main image on hover or click.

```tsx
{
  id: 'room',
  position: { x: 40, y: 50 },
  hoverSrc: '/room-hover.jpg',
  activeSrc: '/room-click.jpg',
  render: (props) => <MySpot {...props} />,
}
```

---

## Swap Animations

10 built-in presets or custom CSS keyframes. Set globally or per-spot - per-spot overrides global.

```tsx
// Global
<ImageSpotMap src="/map.jpg" spots={spots} swapAnimation="zoom" />

// Per-spot override
{
  id: 'bridge',
  hoverSrc: '/bridge.jpg',
  swapAnimation: 'glitch',
  render: (props) => <MySpot {...props} />,
}

// Custom keyframes
<ImageSpotMap
  src="/map.jpg"
  spots={spots}
  swapAnimation={{
    enter: "my-anim 400ms ease forwards",
    leave: "my-exit 400ms ease forwards",
    duration: 400,
  }}
/>
```

Available presets: `fade` `blur` `zoom` `zoom-out` `slide-up` `slide-down` `slide-left` `slide-right` `flip` `glitch` `none`

---

## Scene Chain

Navigate between multiple images with smooth transitions.

```tsx
import { SceneChain } from 'react-image-spots'
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
            style={{ width: '100%', height: '100%', borderRadius: '50%' }}
          />
        ),
      },
    ],
  },
  castle: { src: '/castle.jpg', spots: [] },
}

<SceneChain
  scenes={scenes}
  initialScene="world"
  transition="fade"
  showBreadcrumb={false}
  renderBackButton={({ goBack }) => (
    <button onClick={goBack} style={{ position: 'absolute', top: 16, left: 16 }}>
      Back
    </button>
  )}
/>
```

---

## Layer Scene

`LayerScene` composites several independent image and/or icon layers - no single "background" required, unlike `ImageSpotMap`. Use it for arranging standalone assets (a mascot PNG, a phone-mockup PNG, a handful of decorative icons) rather than adding hotspots to one photo.

Copy-paste quickstart:

```bash
npm install react-image-spots lucide-react
```

```tsx
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
// own floating "Edit this page" toggle - click it to flip edit mode
// for every LayerScene underneath it at the same time.
<SpotsEditProvider>
  <LayerScene layers={layers} onChange={console.log} />
</SpotsEditProvider>
```

That's the whole setup - no other configuration needed. `LayerScene` (and the hooks it uses internally) are already marked `"use client"` in the published bundle, so it works out of the box inside a Next.js App Router server-component tree.

### Optional: icon layers (`lucide-react`)

`lucide-react` is an **optional peer dependency** - install it only if you use `IconLayerDef` layers. Image-only scenes work with zero `lucide-react` installed. If an icon layer is rendered without `lucide-react` present, it shows a dashed placeholder instead of crashing.

```bash
npm install lucide-react
```

Icons are looked up dynamically by name through `resolveIcon(iconName)` (`src/iconRegistry.ts`), so `LayerDef` stays plain, JSON-serializable data - icon layers store a string name (`"Coffee"`), never a component reference.

### Edit mode

`SpotsEditProvider`'s floating toggle (bottom-right by default) turns edit mode on for every `LayerScene` on the page at once - no manual switch, no threading a `mode` prop through each component. An explicit `mode="edit"` on an individual `LayerScene` still overrides it, if you want to control just one instance yourself:

```tsx
<LayerScene
  layers={layers}
  mode="edit"                 // overrides SpotsEditProvider's global toggle
  onChange={(next) => setLayers(next)}
  onExport={(next) => saveDraft(next)}   // clipboard copy + this callback
  autoExportOnChange           // also fires onExport ~500ms after any change
/>
```

Once editing:

- **Toolbar** - a genuine card above the scene box (never glued to its edge or overlaid on top of it): add-icon, bring-to-front, send-to-back, duplicate, delete, and export, as icon buttons (rendered with `lucide-react` if installed, plain-text fallback otherwise) with `title` tooltips. Reorder/duplicate/delete stay visible at all times, just disabled until a layer is selected.
- **Resize handle** - visible square in the bottom-right corner of the selected layer.
- **Rotate handle** - visible circular handle above the selected layer.
- **Layer panel** - a separate card beside the scene box, listing every layer (thumbnail, type, z-index), so a layer hidden behind another is still one click away.
- **Live readout** - below the scene box, the selected layer's x/y/width/height/rotate, read directly from its DOM `getBoundingClientRect()` as you drag.
- **Icon browser** - the add-icon button opens a searchable icon grid (debounced ~150ms) with live icon previews. Search matches substrings and CamelCase-split words, so "shopping bag" finds `ShoppingBag`.

The scene box itself only ever renders the composed layers plus the selected layer's outline and resize/rotate handles - exactly what an end user would see in preview. Everything else lives outside it, so stacking multiple `LayerScene` instances (or one alongside `SpotsEditProvider`'s `backgroundLayers` canvas) never causes their chrome to visually collide.

### Layer animations

Same shape as `ImageSpotMap`'s `swapAnimation` - a preset string, a **configured preset** with tunable duration/intensity, or fully custom keyframes:

| Preset  | Effect                                                        |
| ------- | -------------------------------------------------------------- |
| `none`  | No animation (default)                                         |
| `float` | Subtle, slow `translateY` drift - for decorative icons/mascots |
| `pulse` | Slow opacity pulse                                              |
| `spin`  | Continuous 360° rotation                                        |
| `sway`  | Gentle rotation back and forth                                  |

```tsx
// Plain preset - same subtle look as always
{ id: 'pin', type: 'icon', iconName: 'MapPin', animation: 'float', /* ... */ }

// Configured preset - tune speed and amplitude per layer
{
  id: 'pin',
  type: 'icon',
  iconName: 'MapPin',
  animation: { type: 'float', duration: 2, intensity: 0.8 }, // faster, bigger drift
  /* ... */
}

// Custom keyframes - full control
{
  id: 'pin',
  type: 'icon',
  iconName: 'MapPin',
  animation: { keyframes: 'my-anim 3s ease-in-out infinite', duration: 3000 },
  /* ... */
}
```

`LayerAnimationConfig` fields (both optional - omit either and it falls back to the exact default the plain preset string uses, so configurability never changes the unconfigured look):

| Field       | Type                                        | Default (by `type`)                              | Controls                                                                                                    |
| ----------- | -------------------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `duration`  | `number` (seconds)                           | `float` 4s · `pulse` 2.2s · `spin` 6s · `sway` 3.2s | One full animation cycle's length                                                                             |
| `intensity` | `number` (0-1)                               | `float` 0.3 · `pulse` 0.5 · `sway` 0.3 · ignored for `spin`/`none` | Amplitude: `float` = px of `translateY` (0-1 maps to 0-20px) · `pulse` = how far opacity dips (0-1 maps to a 0-80% swing) · `sway` = rotation range in degrees (0-1 maps to 0-10°) |

In edit mode, selecting a layer with an animation other than `none` shows **Speed** and **Intensity** sliders next to the animation picker (a custom popover, not a native `<select>`) (Intensity is hidden for `spin`, since a full rotation doesn't have an amplitude) - both update the live preview immediately as you drag.

### Responsive layers

Any layer can override `position` / `width` / `height` / `size` / `rotate` per breakpoint - missing fields fall back to the base values:

```tsx
{
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
```

`LayerScene` resolves its own breakpoint from its actual rendered width - not the browser window's - so it responds correctly to *anything* that constrains its width, not just resizing the real window. Default thresholds are `mobile: 640`, `tablet: 1024` (px) - override with the `breakpoints` prop:

```tsx
<LayerScene layers={layers} breakpoints={{ mobile: 480, tablet: 900 }} />
```

While editing, `SpotsEditProvider`'s floating Mobile/Tablet buttons simulate a device viewport by resizing the **whole page** - not just one component - to that width (like a device-preview frame), so every `LayerScene` on the page picks up the matching breakpoint automatically. Dragging a layer while "Mobile" is simulated writes to that layer's `responsive.mobile` override, not the base values.

---

## API

### ImageSpotMap

| Prop                | Type                                         | Default     | Description                             |
| ------------------- | -------------------------------------------- | ----------- | --------------------------------------- |
| `src`               | `string`                                     | required    | Image URL                               |
| `mode`              | `'preview' \| 'edit'`                        | `'preview'` | Interactive spots or position collector |
| `spots`             | `SpotDef[]`                                  | `[]`        | Spot definitions                        |
| `onSpotPlace`       | `(pos, index) => void`                       | -           | edit mode: fired on click               |
| `enableImageSwap`   | `boolean`                                    | `true`      | Enable image swap on hover/click        |
| `swapDuration`      | `number`                                     | `400`       | Swap duration ms                        |
| `swapAnimation`     | `SwapAnimationPreset \| SwapAnimationCustom` | `'fade'`    | Global swap animation                   |
| `hideOthersOnHover` | `boolean`                                    | `true`      | Fade out other spots on hover           |
| `hideHoveredSpot`   | `boolean`                                    | `false`     | Also hide the hovered spot              |
| `onSpotHover`       | `(spot) => void`                             | -           | Fired on mouse enter                    |
| `onSpotClick`       | `(spot) => void`                             | -           | Fired on click                          |
| `onSpotLeave`       | `(spot) => void`                             | -           | Fired on mouse leave                    |

### SceneChain

| Prop                 | Type                                            | Default    | Description                   |
| -------------------- | ----------------------------------------------- | ---------- | ----------------------------- |
| `scenes`             | `Record<string, SceneDef>`                      | required   | Map of sceneId → scene        |
| `initialScene`       | `string`                                        | required   | Starting scene ID             |
| `transition`         | `'fade' \| 'none'`                              | `'fade'`   | Scene transition              |
| `transitionDuration` | `number`                                        | `350`      | Duration ms                   |
| `swapAnimation`      | `SwapAnimationPreset \| SwapAnimationCustom`    | `'fade'`   | Spot swap animation           |
| `hideOthersOnHover`  | `boolean`                                       | `false`    | Fade out other spots on hover |
| `renderBackButton`   | `({ goBack, canGoBack, history }) => ReactNode` | -          | Custom back button            |
| `showBackButton`     | `boolean`                                       | `true`     | Show built-in back button     |
| `backButtonLabel`    | `string`                                        | `'← Back'` | Built-in back button label    |
| `showBreadcrumb`     | `boolean`                                       | `true`     | Show scene breadcrumb         |
| `onSceneChange`      | `(id, scene) => void`                           | -          | Fired on scene change         |
| `onSpotClick`        | `(spot, sceneId) => void`                       | -          | Fired when spot is clicked    |

### SpotDef

| Prop            | Type                                         | Default          | Description                 |
| --------------- | -------------------------------------------- | ---------------- | --------------------------- |
| `id`            | `string`                                     | required         | Unique identifier           |
| `position`      | `{ x: number, y: number }`                   | required         | Position in % (0–100)       |
| `size`          | `{ w: number, h: number }`                   | `{ w: 5, h: 5 }` | Hitbox size in %            |
| `render`        | `(props: SpotRenderProps) => ReactNode`      | required         | Your render function        |
| `hoverSrc`      | `string`                                     | -                | Image URL to swap on hover  |
| `activeSrc`     | `string`                                     | -                | Image URL to swap on click  |
| `swapAnimation` | `SwapAnimationPreset \| SwapAnimationCustom` | -                | Per-spot animation override |

### SpotRenderProps

```ts
interface SpotRenderProps {
	isHovered: boolean;
	isActive: boolean;
	onMouseEnter: (e: MouseEvent) => void;
	onMouseLeave: (e: MouseEvent) => void;
	onClick: (e: MouseEvent) => void;
	goTo: (sceneId: string) => void; // SceneChain only
	goBack: () => void; // SceneChain only
	canGoBack: boolean; // SceneChain only
}
```

### SwapAnimationCustom

```ts
interface SwapAnimationCustom {
	enter: string; // e.g. "my-anim 400ms ease forwards"
	leave?: string;
	duration?: number; // Default: 400
}
```

### LayerScene

| Prop                 | Type                          | Default               | Description                                                       |
| -------------------- | ------------------------------ | ---------------------- | ------------------------------------------------------------------ |
| `layers`             | `LayerDef[]`                    | required               | Image and/or icon layer definitions                                 |
| `mode`                | `'preview' \| 'edit'`          | `'preview'` (or `SpotsEditProvider`) | Overrides `SpotsEditProvider`'s global toggle if set    |
| `onChange`            | `(layers: LayerDef[]) => void` | -                       | Fired after any edit-mode change                                    |
| `onExport`            | `(layers: LayerDef[]) => void` | -                       | Fired by the Export button (+ clipboard copy) and by `autoExportOnChange` |
| `autoExportOnChange`  | `boolean`                       | `false`                 | Auto-fire `onExport` ~500ms after a change settles                   |
| `breakpoints`         | `{ mobile: number, tablet: number }` | `{ mobile: 640, tablet: 1024 }` | Breakpoint width thresholds (px), resolved from this LayerScene's own rendered width |
| `showChrome`          | `boolean`                       | `true`                  | Show the top toolbar + side layer panel. Set `false` when stacking with another LayerScene in the same viewport (e.g. `SpotsEditProvider`'s `backgroundLayers` canvas does this internally) so their chrome doesn't collide - per-layer selection, handles, and readout still work either way |

### LayerDef

A discriminated union - `ImageLayerDef | IconLayerDef` - switched on `type`.

### ImageLayerDef

| Prop         | Type                        | Default  | Description                                    |
| ------------ | --------------------------- | -------- | ----------------------------------------------- |
| `id`         | `string`                     | required | Unique identifier                                |
| `type`       | `'image'`                    | required | Discriminant                                     |
| `src`        | `string`                     | required | Image URL                                        |
| `alt`        | `string`                     | -        | Alt text                                         |
| `position`   | `{ x: number, y: number }`   | required | Position in % (0–100), from the layer's center   |
| `width`      | `number`                     | required | Width in px                                      |
| `height`     | `number`                     | required | Height in px                                     |
| `rotate`     | `number`                     | `0`      | Rotation in degrees                              |
| `zIndex`     | `number`                     | `0`      | Stacking order                                   |
| `dropShadow` | `string`                     | -        | CSS `drop-shadow()` filter value                 |
| `animation`  | `LayerAnimation`             | `'none'` | Preset or custom keyframes                       |
| `responsive` | `LayerResponsiveOverrides`   | -        | Per-breakpoint overrides for position/width/height/rotate |

### IconLayerDef

| Prop         | Type                        | Default  | Description                                    |
| ------------ | --------------------------- | -------- | ----------------------------------------------- |
| `id`         | `string`                     | required | Unique identifier                                |
| `type`       | `'icon'`                     | required | Discriminant                                     |
| `iconName`   | `string`                     | required | Any `lucide-react` export name, e.g. `'Coffee'`  |
| `position`   | `{ x: number, y: number }`   | required | Position in % (0–100), from the layer's center   |
| `size`       | `number`                     | required | Icon box size in px                              |
| `rotate`     | `number`                     | `0`      | Rotation in degrees                              |
| `color`      | `string`                     | -        | Icon color                                       |
| `zIndex`     | `number`                     | `0`      | Stacking order                                   |
| `animation`  | `LayerAnimation`             | `'none'` | Preset or custom keyframes                       |
| `responsive` | `LayerResponsiveOverrides`   | -        | Per-breakpoint overrides for position/size/rotate |

### LayerAnimation

A preset string, a configured preset, or custom keyframes:

```ts
type LayerAnimationPreset = 'none' | 'float' | 'pulse' | 'spin' | 'sway';

interface LayerAnimationConfig {
	type: LayerAnimationPreset;
	duration?: number;  // seconds - see the "Layer animations" defaults table above
	intensity?: number; // 0-1 - see the "Layer animations" defaults table above
}

interface LayerAnimationCustom {
	keyframes: string; // e.g. "my-anim 3s ease-in-out infinite"
	duration?: number; // Default: 3000
}

type LayerAnimation = LayerAnimationPreset | LayerAnimationConfig | LayerAnimationCustom;
```

### SpotsEditProvider

Wraps your whole app (or a page) once and renders its own floating toggle - click it to flip edit mode for every `LayerScene` underneath at the same time. No manual switch, no threading a `mode` prop through each component. An individual `LayerScene`'s own explicit `mode` prop still overrides it.

```tsx
<SpotsEditProvider>
	<LayerScene layers={layers} />
</SpotsEditProvider>

// Controlled, with your own trigger elsewhere in the app:
<SpotsEditProvider editMode={isDevMode} showToggle={false}>
	<LayerScene layers={layers} />
</SpotsEditProvider>
```

| Prop                | Type                                                            | Default          | Description                                                        |
| ------------------- | ---------------------------------------------------------------- | ----------------- | -------------------------------------------------------------------- |
| `children`          | `ReactNode`                                                       | required           | Your whole app or page - wrap it once                                |
| `defaultEditMode`   | `boolean`                                                         | `false`            | Initial edit mode when uncontrolled                                   |
| `editMode`          | `boolean`                                                         | -                  | Controlled edit mode - omit to let the provider manage its own state via the built-in toggle |
| `onEditModeChange`  | `(editMode: boolean) => void`                                     | -                  | Fired whenever edit mode changes                                      |
| `showToggle`        | `boolean`                                                         | `true`             | Show the built-in floating toggle + Mobile/Tablet/Desktop switcher    |
| `togglePosition`    | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'`   | `'bottom-right'`   | Corner for the floating toggle                                        |
| `frameWidths`       | `{ mobile: number, tablet: number }`                              | `{ mobile: 375, tablet: 768 }` | Simulated device widths (px) for the Mobile/Tablet preview frame that wraps `children` |
| `backgroundLayers`  | `LayerDef[]`                                                      | -                  | Page-wide decorative image/icon layers, positioned in % over the full height of `children` - not confined to any single `LayerScene`'s box |
| `onBackgroundLayersChange` | `(layers: LayerDef[]) => void`                             | -                  | Fired after any edit to `backgroundLayers`                            |
| `onBackgroundExport` | `(layers: LayerDef[]) => void`                                   | -                  | Fired by the global panel's "Export background layers" button and by `autoExportBackgroundOnChange` |
| `autoExportBackgroundOnChange` | `boolean`                                              | `false`             | Auto-fire `onBackgroundExport` ~500ms after a change settles          |

#### Page-wide background layers

`backgroundLayers` renders as one overlay canvas spanning the full height of whatever `children` you wrap - place a layer at `y: 60` to land it over whatever section happens to sit 60% down the page, regardless of which `LayerScene` (if any) is there:

```tsx
<SpotsEditProvider
	backgroundLayers={bgLayers}
	onBackgroundLayersChange={setBgLayers}>
	<Hero />
	<Features />
	<Footer />
</SpotsEditProvider>
```

It's purely decorative in preview - pointer events pass through to your real page content underneath, so it never blocks buttons or links. While editing, it becomes draggable/selectable like any other layer, but renders with `showChrome={false}` internally (no competing toolbar/panel) so it doesn't collide with a `LayerScene` that happens to be on screen at the same time - only the shared floating panel (edit toggle, breakpoint switcher, background export) is global; each `LayerScene`'s own toolbar and layer panel stay local to that instance.

---

## License

MIT
