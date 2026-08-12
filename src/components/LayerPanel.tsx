import React from "react";
import { useLucideIcon } from "../iconRegistry";
import { useDraggable } from "./useDraggable";
import type { LayerDef } from "../types";

const FONT = "system-ui,sans-serif";
const ACCENT = "#3b82f6";

const IconGlyph: React.FC<{
	iconName: string;
	size: number;
	color?: string;
}> = ({ iconName, size, color }) => {
	const Icon = useLucideIcon(iconName);
	if (Icon) return <Icon size={size} color={color} />;
	return (
		<div
			style={{
				width: size,
				height: size,
				borderRadius: 4,
				border: "1.5px dashed #94a3b8",
			}}
		/>
	);
};

export interface LayerPanelProps {
	title: string;
	layers: LayerDef[];
	selectedId: string | null;
	onSelect: (id: string) => void;
	defaultCorner?: React.CSSProperties;
	position?: "absolute" | "fixed";
	zIndex?: number;
}

/**
 * Shared floating, draggable layers list used identically by every
 * `LayerScene` instance AND `SpotsEditProvider`'s `backgroundLayers` canvas.
 * Never overlaps the scene box it's paired with - it's a genuine sibling
 * element, positioned independently.
 */
export const LayerPanel: React.FC<LayerPanelProps> = ({
	title,
	layers,
	selectedId,
	onSelect,
	defaultCorner = { top: 0, right: 0 },
	position = "absolute",
	zIndex = 50,
}) => {
	const { ref, style, dragHandleProps } = useDraggable(defaultCorner, position);

	return (
		<div
			ref={ref}
			style={{
				...style,
				zIndex,
				width: 200,
				maxHeight: 320,
				display: "flex",
				flexDirection: "column",
				background: "#f8fafc",
				border: "1.5px solid #e2e8f0",
				borderRadius: 10,
				boxShadow: "0 4px 16px rgba(15,23,42,0.12)",
				fontFamily: FONT,
				overflow: "hidden",
			}}>
			<div
				{...dragHandleProps}
				title='Drag to move'
				style={{
					display: "flex",
					alignItems: "center",
					gap: 6,
					padding: "6px 8px",
					cursor: "grab",
					touchAction: "none",
					borderBottom: "1px solid #e2e8f0",
					background: "white",
				}}>
				<span style={{ color: "#cbd5e1", fontSize: 12 }}>⠿</span>
				<span
					style={{
						fontSize: 11,
						fontWeight: 700,
						color: "#94a3b8",
						textTransform: "uppercase",
						letterSpacing: 0.4,
					}}>
					{title} ({layers.length})
				</span>
			</div>
			<div style={{ overflowY: "auto", padding: 8 }}>
				{[...layers]
					.sort((a, b) => (b.zIndex ?? 0) - (a.zIndex ?? 0))
					.map((layer) => (
						<button
							key={layer.id}
							onPointerDown={(e) => e.stopPropagation()}
							onClick={(e) => {
								e.stopPropagation();
								onSelect(layer.id);
							}}
							style={{
								display: "flex",
								alignItems: "center",
								gap: 8,
								width: "100%",
								padding: 6,
								marginBottom: 4,
								borderRadius: 8,
								border:
									selectedId === layer.id
										? `1.5px solid ${ACCENT}`
										: "1.5px solid transparent",
								background:
									selectedId === layer.id ? "rgba(59,130,246,0.08)" : "white",
								cursor: "pointer",
								textAlign: "left",
							}}>
							<div
								style={{
									width: 28,
									height: 28,
									borderRadius: 6,
									overflow: "hidden",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									background: "white",
									border: "1px solid #e2e8f0",
									flexShrink: 0,
								}}>
								{layer.type === "image" ? (
									<img
										src={layer.src}
										alt=''
										style={{
											width: "100%",
											height: "100%",
											objectFit: "cover",
										}}
									/>
								) : (
									<IconGlyph
										iconName={layer.iconName}
										size={15}
										color={layer.color}
									/>
								)}
							</div>
							<div style={{ minWidth: 0 }}>
								<div
									style={{
										fontSize: 11,
										fontWeight: 600,
										color: "#334155",
										textOverflow: "ellipsis",
										overflow: "hidden",
										whiteSpace: "nowrap",
									}}>
									{layer.type === "image"
										? layer.alt || layer.id
										: layer.iconName}
								</div>
								<div style={{ fontSize: 10, color: "#94a3b8" }}>
									{layer.type} · z:{layer.zIndex ?? 0}
								</div>
							</div>
						</button>
					))}
			</div>
		</div>
	);
};
