# react-image-spots

Interactive image hotspots for React. Define spots in code, render anything, navigate between scenes with animations.

[![npm](https://img.shields.io/npm/v/react-image-spots)](https://npmjs.com/package/react-image-spots)
[![tests](https://github.com/your-username/react-image-spots/actions/workflows/ci.yml/badge.svg)](https://github.com/your-username/react-image-spots/actions/workflows/ci.yml)
[![license](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

---

## Install

```bash
npm install react-image-spots
```

Requires React 17+. No runtime dependencies.

---

## Collecting Spot Positions

Switch to `mode="edit"` during development. Click anywhere on the image — the `x/y` position is instantly copied to your clipboard.

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

10 built-in presets or custom CSS keyframes. Set globally or per-spot — per-spot overrides global.

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

## API

### ImageSpotMap

| Prop                | Type                                         | Default     | Description                             |
| ------------------- | -------------------------------------------- | ----------- | --------------------------------------- |
| `src`               | `string`                                     | required    | Image URL                               |
| `mode`              | `'preview' \| 'edit'`                        | `'preview'` | Interactive spots or position collector |
| `spots`             | `SpotDef[]`                                  | `[]`        | Spot definitions                        |
| `onSpotPlace`       | `(pos, index) => void`                       | —           | edit mode: fired on click               |
| `enableImageSwap`   | `boolean`                                    | `true`      | Enable image swap on hover/click        |
| `swapDuration`      | `number`                                     | `400`       | Swap duration ms                        |
| `swapAnimation`     | `SwapAnimationPreset \| SwapAnimationCustom` | `'fade'`    | Global swap animation                   |
| `hideOthersOnHover` | `boolean`                                    | `true`      | Fade out other spots on hover           |
| `hideHoveredSpot`   | `boolean`                                    | `false`     | Also hide the hovered spot              |
| `onSpotHover`       | `(spot) => void`                             | —           | Fired on mouse enter                    |
| `onSpotClick`       | `(spot) => void`                             | —           | Fired on click                          |
| `onSpotLeave`       | `(spot) => void`                             | —           | Fired on mouse leave                    |

### SceneChain

| Prop                 | Type                                            | Default    | Description                   |
| -------------------- | ----------------------------------------------- | ---------- | ----------------------------- |
| `scenes`             | `Record<string, SceneDef>`                      | required   | Map of sceneId → scene        |
| `initialScene`       | `string`                                        | required   | Starting scene ID             |
| `transition`         | `'fade' \| 'none'`                              | `'fade'`   | Scene transition              |
| `transitionDuration` | `number`                                        | `350`      | Duration ms                   |
| `swapAnimation`      | `SwapAnimationPreset \| SwapAnimationCustom`    | `'fade'`   | Spot swap animation           |
| `hideOthersOnHover`  | `boolean`                                       | `false`    | Fade out other spots on hover |
| `renderBackButton`   | `({ goBack, canGoBack, history }) => ReactNode` | —          | Custom back button            |
| `showBackButton`     | `boolean`                                       | `true`     | Show built-in back button     |
| `backButtonLabel`    | `string`                                        | `'← Back'` | Built-in back button label    |
| `showBreadcrumb`     | `boolean`                                       | `true`     | Show scene breadcrumb         |
| `onSceneChange`      | `(id, scene) => void`                           | —          | Fired on scene change         |
| `onSpotClick`        | `(spot, sceneId) => void`                       | —          | Fired when spot is clicked    |

### SpotDef

| Prop            | Type                                         | Default          | Description                 |
| --------------- | -------------------------------------------- | ---------------- | --------------------------- |
| `id`            | `string`                                     | required         | Unique identifier           |
| `position`      | `{ x: number, y: number }`                   | required         | Position in % (0–100)       |
| `size`          | `{ w: number, h: number }`                   | `{ w: 5, h: 5 }` | Hitbox size in %            |
| `render`        | `(props: SpotRenderProps) => ReactNode`      | required         | Your render function        |
| `hoverSrc`      | `string`                                     | —                | Image URL to swap on hover  |
| `activeSrc`     | `string`                                     | —                | Image URL to swap on click  |
| `swapAnimation` | `SwapAnimationPreset \| SwapAnimationCustom` | —                | Per-spot animation override |

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

---

## License

MIT
