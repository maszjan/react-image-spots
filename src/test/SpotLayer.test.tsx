import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { SpotLayer } from "../components/SpotLayer";
import type { SpotDef } from "../types";

const makeSpot = (overrides?: Partial<SpotDef>): SpotDef => ({
	id: "spot-1",
	position: { x: 30, y: 50 },
	render: ({ isHovered, onMouseEnter, onMouseLeave, onClick }) => (
		<div
			data-testid='spot'
			data-hovered={String(isHovered)}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			onClick={onClick}
		/>
	),
	...overrides,
});

const defaultProps = {
	goTo: vi.fn(),
	goBack: vi.fn(),
	canGoBack: false,
};

describe("SpotLayer", () => {
	it("renders all spots", () => {
		const spots = [
			makeSpot({ id: "a" }),
			makeSpot({ id: "b" }),
			makeSpot({ id: "c" }),
		];
		const { getAllByTestId } = render(
			<SpotLayer spots={spots} {...defaultProps} />,
		);
		expect(getAllByTestId("spot")).toHaveLength(3);
	});

	it("calls onSpotHover on mouse enter", () => {
		const onSpotHover = vi.fn();
		const spot = makeSpot();
		const { getByTestId } = render(
			<SpotLayer spots={[spot]} onSpotHover={onSpotHover} {...defaultProps} />,
		);
		fireEvent.mouseEnter(getByTestId("spot"));
		expect(onSpotHover).toHaveBeenCalledWith(spot);
	});

	it("calls onSpotLeave on mouse leave", () => {
		const onSpotLeave = vi.fn();
		const spot = makeSpot();
		const { getByTestId } = render(
			<SpotLayer spots={[spot]} onSpotLeave={onSpotLeave} {...defaultProps} />,
		);
		fireEvent.mouseLeave(getByTestId("spot"));
		expect(onSpotLeave).toHaveBeenCalledWith(spot);
	});

	it("calls onSpotClick on click", () => {
		const onSpotClick = vi.fn();
		const spot = makeSpot();
		const { getByTestId } = render(
			<SpotLayer spots={[spot]} onSpotClick={onSpotClick} {...defaultProps} />,
		);
		fireEvent.click(getByTestId("spot"));
		expect(onSpotClick).toHaveBeenCalledWith(spot);
	});

	it("passes isHovered=true to hovered spot render", () => {
		const spot = makeSpot();
		const { getByTestId } = render(
			<SpotLayer spots={[spot]} {...defaultProps} />,
		);
		fireEvent.mouseEnter(getByTestId("spot"));
		expect(getByTestId("spot").getAttribute("data-hovered")).toBe("true");
	});

	it("sets isHovered=false after mouse leave", () => {
		const spot = makeSpot();
		const { getByTestId } = render(
			<SpotLayer spots={[spot]} {...defaultProps} />,
		);
		fireEvent.mouseEnter(getByTestId("spot"));
		fireEvent.mouseLeave(getByTestId("spot"));
		expect(getByTestId("spot").getAttribute("data-hovered")).toBe("false");
	});

	it("hides other spots when one is hovered", () => {
		const spots = [
			makeSpot({
				id: "a",
				render: ({ onMouseEnter, onMouseLeave }) => (
					<div
						data-testid='spot-a'
						onMouseEnter={onMouseEnter}
						onMouseLeave={onMouseLeave}
					/>
				),
			}),
			makeSpot({ id: "b", render: () => <div data-testid='spot-b' /> }),
		];
		const { getByTestId } = render(
			<SpotLayer spots={spots} {...defaultProps} />,
		);
		fireEvent.mouseEnter(getByTestId("spot-a"));
		const spotBWrapper = getByTestId("spot-b").parentElement!;
		expect(spotBWrapper.style.opacity).toBe("0");
	});

	it("calls onSwapRequest with hoverSrc on mouse enter", () => {
		const onSwapRequest = vi.fn();
		const spot = makeSpot({ hoverSrc: "/hover.jpg" });
		const { getByTestId } = render(
			<SpotLayer
				spots={[spot]}
				onSwapRequest={onSwapRequest}
				{...defaultProps}
			/>,
		);
		fireEvent.mouseEnter(getByTestId("spot"));
		expect(onSwapRequest).toHaveBeenCalledWith("/hover.jpg", undefined);
	});

	it("calls onSwapRequest with null on mouse leave", () => {
		const onSwapRequest = vi.fn();
		const spot = makeSpot({ hoverSrc: "/hover.jpg" });
		const { getByTestId } = render(
			<SpotLayer
				spots={[spot]}
				onSwapRequest={onSwapRequest}
				{...defaultProps}
			/>,
		);
		fireEvent.mouseEnter(getByTestId("spot"));
		fireEvent.mouseLeave(getByTestId("spot"));
		expect(onSwapRequest).toHaveBeenLastCalledWith(null, undefined);
	});

	it("positions spot using % from SpotDef", () => {
		const spot = makeSpot({ position: { x: 42, y: 67 }, size: { w: 8, h: 8 } });
		const { getByTestId } = render(
			<SpotLayer spots={[spot]} {...defaultProps} />,
		);
		const wrapper = getByTestId("spot").parentElement!;
		expect(wrapper.style.left).toBe("42%");
		expect(wrapper.style.top).toBe("67%");
		expect(wrapper.style.width).toBe("8%");
		expect(wrapper.style.height).toBe("8%");
	});

	it("uses default size 5x5 when not provided", () => {
		const spot = makeSpot();
		const { getByTestId } = render(
			<SpotLayer spots={[spot]} {...defaultProps} />,
		);
		const wrapper = getByTestId("spot").parentElement!;
		expect(wrapper.style.width).toBe("5%");
		expect(wrapper.style.height).toBe("5%");
	});
});
