import React, { useCallback, useState } from "react";
import type { MouseEvent } from "react";
import type { SpotDef, SpotRenderProps, SwapAnimation } from "../types";

interface SpotLayerProps {
	spots: SpotDef[];
	hideOthersOnHover?: boolean;
	hideHoveredSpot?: boolean;
	onSpotHover?: (spot: SpotDef | null) => void;
	onSpotClick?: (spot: SpotDef) => void;
	onSpotLeave?: (spot: SpotDef) => void;
	onSwapRequest?: (src: string | null, animation?: SwapAnimation) => void;
	goTo: (sceneId: string) => void;
	goBack: () => void;
	canGoBack: boolean;
}

export const SpotLayer: React.FC<SpotLayerProps> = ({
	spots,
	hideOthersOnHover = true,
	hideHoveredSpot = false,
	onSpotHover,
	onSpotClick,
	onSpotLeave,
	onSwapRequest,
	goTo,
	goBack,
	canGoBack,
}) => {
	const [hoveredId, setHoveredId] = useState<string | null>(null);
	const [activeId, setActiveId] = useState<string | null>(null);

	const makeHandlers = useCallback(
		(spot: SpotDef) => ({
			onMouseEnter: (_e: MouseEvent) => {
				setHoveredId(spot.id);
				onSpotHover?.(spot);
				if (spot.hoverSrc) onSwapRequest?.(spot.hoverSrc, spot.swapAnimation);
			},
			onMouseLeave: (_e: MouseEvent) => {
				setHoveredId(null);
				onSpotLeave?.(spot);
				setActiveId((aid) => {
					if (!aid) onSwapRequest?.(null, spot.swapAnimation);
					return aid;
				});
			},
			onClick: (_e: MouseEvent) => {
				setActiveId((prev) => {
					const next = prev === spot.id ? null : spot.id;
					if (next && spot.activeSrc)
						onSwapRequest?.(spot.activeSrc, spot.swapAnimation);
					else if (!next) onSwapRequest?.(null, spot.swapAnimation);
					return next;
				});
				onSpotClick?.(spot);
			},
		}),
		[onSpotHover, onSpotClick, onSpotLeave, onSwapRequest],
	);

	return (
		<>
			{spots.map((spot) => {
				const isHovered = hoveredId === spot.id;
				const isActive = activeId === spot.id;
				const isOtherHovered =
					hideOthersOnHover && hoveredId !== null && hoveredId !== spot.id;
				const isCurrentHovered = hideHoveredSpot && hoveredId === spot.id;
				const shouldHide = isOtherHovered || isCurrentHovered;
				const size = spot.size ?? { w: 5, h: 5 };

				const renderProps: SpotRenderProps = {
					isHovered,
					isActive,
					goTo,
					goBack,
					canGoBack,
					...makeHandlers(spot),
				};

				return (
					<div
						key={spot.id}
						style={{
							position: "absolute",
							left: `${spot.position.x}%`,
							top: `${spot.position.y}%`,
							width: `${size.w}%`,
							height: `${size.h}%`,
							transform: "translate(-50%, -50%)",
							zIndex: isHovered || isActive ? 30 : 20,
							opacity: shouldHide ? 0 : 1,
							transition: "opacity 0.35s ease",
							pointerEvents: isOtherHovered ? "none" : "auto",
						}}>
						{spot.render(renderProps)}
					</div>
				);
			})}
		</>
	);
};
