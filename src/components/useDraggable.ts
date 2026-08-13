import { useCallback, useRef, useState, type CSSProperties } from "react";

export interface AnchorRect {
	top: number;
	left: number;
	right: number;
	bottom: number;
}

export interface DraggableHandle {
	ref: (el: HTMLDivElement | null) => void;
	style: CSSProperties;
	dragHandleProps: {
		onPointerDown: (e: React.PointerEvent) => void;
	};
}

/**
 * Makes a `position: absolute` (or `fixed`) element draggable by its handle.
 * Renders at `defaultCorner` (e.g. `{ top: 0, left: 0 }`) until the user
 * first drags it, then switches to an explicit `left`/`top` pixel position
 * that follows the pointer - not persisted across reloads, just in-memory
 * for the session.
 *
 * When `anchorRect` is given (viewport coordinates, e.g. from a portalled
 * element's `getBoundingClientRect()`), `defaultCorner`'s `top`/`left`/
 * `right`/`bottom` numbers are treated as offsets from that rect's matching
 * edge instead of raw CSS values - this lets a `position: fixed` element
 * rendered via a portal (so no ancestor container can clip it) still visually
 * anchor itself near an arbitrary element on the page. Omit `anchorRect` to
 * use `defaultCorner` as literal viewport-fixed CSS values (e.g. a toolbar
 * that's meant to sit in a fixed screen corner regardless of any anchor).
 */
export function useDraggable(
	defaultCorner: CSSProperties,
	position: "absolute" | "fixed" = "absolute",
	anchorRect?: AnchorRect | null,
): DraggableHandle {
	const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
	const elRef = useRef<HTMLDivElement | null>(null);

	const onPointerDown = useCallback((e: React.PointerEvent) => {
		e.stopPropagation();
		const el = elRef.current;
		const startLeft = el?.offsetLeft ?? 0;
		const startTop = el?.offsetTop ?? 0;
		const startX = e.clientX;
		const startY = e.clientY;

		const onMove = (ev: PointerEvent) => {
			setDragPos({
				x: startLeft + (ev.clientX - startX),
				y: startTop + (ev.clientY - startY),
			});
		};
		const onUp = () => {
			window.removeEventListener("pointermove", onMove);
			window.removeEventListener("pointerup", onUp);
		};
		window.addEventListener("pointermove", onMove);
		window.addEventListener("pointerup", onUp);
	}, []);

	const resolveDefaultStyle = (): CSSProperties => {
		if (!anchorRect) return { position, ...defaultCorner };
		const corner = defaultCorner as Record<string, number | undefined>;
		const style: CSSProperties = { position };
		if (corner.top != null) style.top = anchorRect.top + corner.top;
		if (corner.left != null) style.left = anchorRect.left + corner.left;
		if (corner.right != null) {
			style.right = window.innerWidth - anchorRect.right + corner.right;
		}
		if (corner.bottom != null) {
			style.bottom = window.innerHeight - anchorRect.bottom + corner.bottom;
		}
		return style;
	};

	return {
		ref: (el) => {
			elRef.current = el;
		},
		style: dragPos ? { position, left: dragPos.x, top: dragPos.y } : resolveDefaultStyle(),
		dragHandleProps: { onPointerDown },
	};
}
