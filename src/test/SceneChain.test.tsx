import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { SceneChain } from "../SceneChain";
import type { SceneDef } from "../types";

const makeScene = (id: string, spotIds: string[] = []): SceneDef => ({
	src: `/${id}.jpg`,
	alt: id,
	spots: spotIds.map((sid) => ({
		id: sid,
		position: { x: 50, y: 50 },
		render: ({ onClick, goTo }) => (
			<div
				data-testid={`spot-${sid}`}
				onClick={(e) => {
					onClick(e as any);
					goTo(sid);
				}}
			/>
		),
	})),
});

const scenes = {
	map: makeScene("map", ["bridge"]),
	bridge: makeScene("bridge"),
	slums: makeScene("slums"),
};

describe("SceneChain", () => {
	it("renders initial scene", () => {
		const { container } = render(
			<SceneChain scenes={scenes} initialScene='map' transition='none' />,
		);
		expect(container.innerHTML).toBeTruthy();
	});

	it("does not show back button on initial scene", () => {
		const { queryByText } = render(
			<SceneChain
				scenes={scenes}
				initialScene='map'
				transition='none'
				showBackButton
			/>,
		);
		expect(queryByText("← Back")).toBeNull();
	});

	it("calls onSceneChange on goTo", () => {
		const onSceneChange = vi.fn();
		const { getByTestId } = render(
			<SceneChain
				scenes={scenes}
				initialScene='map'
				transition='none'
				onSceneChange={onSceneChange}
			/>,
		);
		fireEvent.click(getByTestId("spot-bridge"));
		expect(onSceneChange).toHaveBeenCalledWith("bridge", scenes.bridge);
	});

	it("shows back button after navigating", () => {
		const { getByTestId, getByText } = render(
			<SceneChain
				scenes={scenes}
				initialScene='map'
				transition='none'
				showBackButton
			/>,
		);
		fireEvent.click(getByTestId("spot-bridge"));
		expect(getByText("← Back")).toBeTruthy();
	});

	it("goBack returns to previous scene", () => {
		const onSceneChange = vi.fn();
		const { getByTestId, getByText } = render(
			<SceneChain
				scenes={scenes}
				initialScene='map'
				transition='none'
				onSceneChange={onSceneChange}
				showBackButton
			/>,
		);
		fireEvent.click(getByTestId("spot-bridge"));
		fireEvent.click(getByText("← Back"));
		expect(onSceneChange).toHaveBeenLastCalledWith("map", scenes.map);
	});

	it("hides back button when showBackButton=false", () => {
		const { getByTestId, queryByText } = render(
			<SceneChain
				scenes={scenes}
				initialScene='map'
				transition='none'
				showBackButton={false}
			/>,
		);
		fireEvent.click(getByTestId("spot-bridge"));
		expect(queryByText("← Back")).toBeNull();
	});

	it("shows breadcrumb after navigation", () => {
		const { getByTestId, container } = render(
			<SceneChain
				scenes={scenes}
				initialScene='map'
				transition='none'
				showBreadcrumb
			/>,
		);
		fireEvent.click(getByTestId("spot-bridge"));
		expect(container.innerHTML).toContain("bridge");
	});

	it("hides breadcrumb when showBreadcrumb=false", () => {
		const { getByTestId, queryByText } = render(
			<SceneChain
				scenes={scenes}
				initialScene='map'
				transition='none'
				showBreadcrumb={false}
			/>,
		);
		fireEvent.click(getByTestId("spot-bridge"));
		expect(queryByText("bridge")).toBeNull();
	});

	it("calls onSpotClick with spot and sceneId", () => {
		const onSpotClick = vi.fn();
		const { getByTestId } = render(
			<SceneChain
				scenes={scenes}
				initialScene='map'
				transition='none'
				onSpotClick={onSpotClick}
			/>,
		);
		fireEvent.click(getByTestId("spot-bridge"));
		expect(onSpotClick).toHaveBeenCalledWith(
			expect.objectContaining({ id: "bridge" }),
			"map",
		);
	});

	it("warns and stays on scene when goTo is called with unknown sceneId", () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
		const onSceneChange = vi.fn();

		const scenesWithBadSpot = {
			map: {
				src: "/map.jpg",
				alt: "map",
				spots: [
					{
						id: "bad",
						position: { x: 50, y: 50 },
						render: ({ onClick, goTo }: any) => (
							<div
								data-testid='bad-spot'
								onClick={(e) => {
									onClick(e);
									goTo("nonexistent");
								}}
							/>
						),
					},
				],
			},
		};

		const { getByTestId } = render(
			<SceneChain
				scenes={scenesWithBadSpot}
				initialScene='map'
				transition='none'
				onSceneChange={onSceneChange}
			/>,
		);
		fireEvent.click(getByTestId("bad-spot"));
		expect(warn).toHaveBeenCalledWith(
			expect.stringContaining("nonexistent"),
			expect.anything(),
		);
		expect(onSceneChange).not.toHaveBeenCalled();
		warn.mockRestore();
	});
});
