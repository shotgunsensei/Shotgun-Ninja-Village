import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { EnlistedCounter } from "@/components/shared/EnlistedCounter";

vi.mock("@workspace/api-client-react", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@workspace/api-client-react")>();
  return {
    ...actual,
    useGetSignupsCount: vi.fn(),
  };
});

import { useGetSignupsCount } from "@workspace/api-client-react";

const mockedHook = vi.mocked(useGetSignupsCount);

function hookResult(overrides: Record<string, unknown>) {
  return {
    data: undefined,
    error: null,
    isError: false,
    isLoading: false,
    ...overrides,
  } as unknown as ReturnType<typeof useGetSignupsCount>;
}

beforeEach(() => {
  mockedHook.mockReset();
});

afterEach(() => {
  cleanup();
});

describe("EnlistedCounter", () => {
  it("renders the enlisted count when data is available", () => {
    mockedHook.mockReturnValue(hookResult({ data: { count: 1234 } }));
    render(<EnlistedCounter />);
    const counter = screen.getByTestId("enlisted-counter");
    expect(counter.textContent).toContain("1,234");
    expect(counter.textContent).toMatch(/Operators Enlisted/i);
  });

  it("renders a zero count rather than hiding", () => {
    mockedHook.mockReturnValue(hookResult({ data: { count: 0 } }));
    render(<EnlistedCounter />);
    expect(
      screen.getByTestId("enlisted-counter").textContent,
    ).toContain("0 Operators Enlisted");
  });

  it("renders nothing while the request is loading", () => {
    mockedHook.mockReturnValue(hookResult({ isLoading: true }));
    render(<EnlistedCounter />);
    expect(screen.queryByTestId("enlisted-counter")).toBeNull();
  });

  it("hides gracefully when the count endpoint fails", () => {
    mockedHook.mockReturnValue(
      hookResult({ isError: true, error: new Error("boom") }),
    );
    const { container } = render(<EnlistedCounter />);
    expect(screen.queryByTestId("enlisted-counter")).toBeNull();
    expect(container.textContent).toBe("");
  });
});
