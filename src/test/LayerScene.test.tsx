import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { LayerScene } from "../LayerScene";
import { SpotsEditProvider } from "../SpotsEditProvider";
import { getEffectiveLayerValues, updateLayerAtBreakpoint } from "../layerResolve";
import type { ImageLayerDef, IconLayerDef, LayerDef } from "../types";

const imageLayer = (overrides?: Partial<ImageLayerDef>): ImageLayerDef => ({
	id: "img-1",
	type: "image",
	src: "/mascot.png",
	alt: "Mascot",
	position: { x: 40, y: 50 },
	width: 120,
	height: 120,
	rotate: 0,
	zIndex: 1,
	...overrides,
});

const iconLayer = (overrides?: Partial<IconLayerDef>): IconLayerDef => ({
	id: "icon-1",
	type: "icon",
	iconName: "Coffee",
	position: { x: 60, y: 30 },
	size: 32,
	rotate: 0,
	zIndex: 2,
	...overrides,
});

describe("LayerScene", () => {
	it("renders all layers in preview mode", () => {
		const layers: LayerDef[] = [imageLayer(), iconLayer()];
		const { container } = render(<LayerScene layers={layers} mode='preview' />);
		expect(container.querySelector("img[src='/mascot.png']")).toBeTruthy();
	});

	it("does not show edit UI in preview mode", () => {
		const { queryByTitle } = render(
			<LayerScene layers={[imageLayer()]} mode='preview' />,
		);
		expect(queryByTitle(/Export layers/)).toBeNull();
		expect(queryByTitle("Add icon layer")).toBeNull();
	});

	it("shows edit UI (toolbar buttons) in edit mode", () => {
		const { getByTitle } = render(<LayerScene layers={[imageLayer()]} mode='edit' />);
		expect(getByTitle(/Export layers/)).toBeTruthy();
		expect(getByTitle("Add icon layer")).toBeTruthy();
	});

	it("shows the layer panel listing every layer in edit mode", () => {
		const layers = [imageLayer(), iconLayer()];
		const { getByText } = render(<LayerScene layers={layers} mode='edit' />);
		expect(getByText("Layers (2)")).toBeTruthy();
	});

	it("selects a layer when clicked in the layer panel and shows its toolbar", () => {
		const layers = [imageLayer(), iconLayer()];
		const { getByText, getByTitle } = render(
			<LayerScene layers={layers} mode='edit' />,
		);
		fireEvent.click(getByText("Mascot"));
		expect(getByTitle("Bring to front")).toBeTruthy();
		expect(getByTitle("Delete layer")).toBeTruthy();
	});

	it("bring to front updates zIndex above all other layers", () => {
		const layers = [
			imageLayer({ id: "a", zIndex: 1 }),
			imageLayer({ id: "b", zIndex: 5, alt: "B" }),
		];
		const onChange = vi.fn();
		const { getByText, getByTitle } = render(
			<LayerScene layers={layers} mode='edit' onChange={onChange} />,
		);
		fireEvent.click(getByText("Mascot"));
		fireEvent.click(getByTitle("Bring to front"));
		const updated = onChange.mock.calls[onChange.mock.calls.length - 1][0] as LayerDef[];
		const a = updated.find((l) => l.id === "a")!;
		expect(a.zIndex).toBeGreaterThan(5);
	});

	it("deletes a layer via the toolbar", () => {
		const layers = [imageLayer(), iconLayer()];
		const onChange = vi.fn();
		const { getByText, getByTitle, queryByText } = render(
			<LayerScene layers={layers} mode='edit' onChange={onChange} />,
		);
		fireEvent.click(getByText("Mascot"));
		fireEvent.click(getByTitle("Delete layer"));
		expect(queryByText("Layers (1)")).toBeTruthy();
	});

	it("duplicates a layer via the toolbar", () => {
		const layers = [imageLayer()];
		const { getByText, getByTitle, queryByText } = render(
			<LayerScene layers={layers} mode='edit' />,
		);
		fireEvent.click(getByText("Mascot"));
		fireEvent.click(getByTitle("Duplicate layer"));
		expect(queryByText("Layers (2)")).toBeTruthy();
	});

	it("opens the icon browser and adds an icon layer", () => {
		const layers: LayerDef[] = [];
		const { getByTitle, getByText, getByPlaceholderText } = render(
			<LayerScene layers={layers} mode='edit' />,
		);
		fireEvent.click(getByTitle("Add icon layer"));
		expect(getByPlaceholderText(/Search icons/)).toBeTruthy();
		fireEvent.click(getByText("Coffee"));
		expect(getByText("Layers (1)")).toBeTruthy();
	});

	it("prop mode overrides SpotsEditProvider context", () => {
		const { queryByTitle } = render(
			<SpotsEditProvider editMode>
				<LayerScene layers={[imageLayer()]} mode='preview' />
			</SpotsEditProvider>,
		);
		expect(queryByTitle(/Export layers/)).toBeNull();
	});

	it("falls back to SpotsEditProvider context when mode prop is omitted", () => {
		const { getByTitle } = render(
			<SpotsEditProvider editMode>
				<LayerScene layers={[imageLayer()]} />
			</SpotsEditProvider>,
		);
		expect(getByTitle(/Export layers/)).toBeTruthy();
	});

	it("defaults to preview mode outside any provider", () => {
		const { queryByTitle } = render(<LayerScene layers={[imageLayer()]} />);
		expect(queryByTitle(/Export layers/)).toBeNull();
	});
});

describe("layerResolve", () => {
	it("falls back to base values when no responsive override exists", () => {
		const layer = imageLayer();
		const effective = getEffectiveLayerValues(layer, "mobile");
		expect(effective.position).toEqual(layer.position);
		expect(effective.width).toBe(layer.width);
	});

	it("applies a responsive override for the resolved breakpoint", () => {
		const layer = imageLayer({
			responsive: { mobile: { position: { x: 10, y: 10 }, width: 60 } },
		});
		const effective = getEffectiveLayerValues(layer, "mobile");
		expect(effective.position).toEqual({ x: 10, y: 10 });
		expect(effective.width).toBe(60);
		expect(effective.height).toBe(layer.height);
	});

	it("writes patches to responsive.<breakpoint> for non-desktop breakpoints", () => {
		const layer = imageLayer();
		const next = updateLayerAtBreakpoint(layer, "tablet", { position: { x: 5, y: 5 } });
		expect(next.position).toEqual(layer.position);
		expect(next.responsive?.tablet?.position).toEqual({ x: 5, y: 5 });
	});

	it("writes patches to base fields for the desktop breakpoint", () => {
		const layer = imageLayer();
		const next = updateLayerAtBreakpoint(layer, "desktop", { position: { x: 5, y: 5 } });
		expect(next.position).toEqual({ x: 5, y: 5 });
		expect(next.responsive).toBeUndefined();
	});
});
