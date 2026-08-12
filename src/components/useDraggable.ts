import { useCallback, useRef, useState, type CSSProperties } from "react";

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
 */
export function useDraggable(
	defaultCorner: CSSProperties,
	position: "absolute" | "fixed" = "absolute",
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

	return {
		ref: (el) => {
			elRef.current = el;
		},
		style: dragPos
			? { position, left: dragPos.x, top: dragPos.y }
			: { position, ...defaultCorner },
		dragHandleProps: { onPointerDown },
	};
}
