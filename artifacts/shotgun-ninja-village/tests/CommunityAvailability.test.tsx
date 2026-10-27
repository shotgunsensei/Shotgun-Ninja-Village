import React from "react";
import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import Community from "@/pages/Community";
const api = vi.hoisted(() => ({
  categories: vi.fn(),
  topics: vi.fn(),
  stats: vi.fn(),
}));
vi.mock("@/auth/AuthContext", () => ({ useAuth: () => ({ user: null }) }));
vi.mock("@/services/community", async (original) => ({
  ...(await original<typeof import("@/services/community")>()),
  communityApi: api,
}));
beforeAll(() =>
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  ),
);
afterAll(() => vi.unstubAllGlobals());
afterEach(cleanup);
beforeEach(() => {
  vi.clearAllMocks();
  api.categories.mockResolvedValue({ categories: [] });
  api.topics.mockResolvedValue({ topics: [] });
});
describe("community activity availability", () => {
  it("does not turn pending activity into a zero or online claim", () => {
    api.stats.mockReturnValue(new Promise(() => {}));
    render(<Community />);
    const activity = within(
      screen.getByRole("group", { name: "Community activity" }),
    );
    expect(activity.getByText("Loading activity")).toBeTruthy();
    expect(activity.getAllByText("—")).toHaveLength(4);
    expect(screen.queryByText(/public network online|live data/i)).toBeNull();
  });
  it("keeps failed activity explicitly unavailable", async () => {
    api.stats.mockRejectedValue(new Error("Synthetic offline fixture"));
    render(<Community />);
    await waitFor(() =>
      expect(screen.getByRole("alert").textContent).toContain(
        "Synthetic offline fixture",
      ),
    );
    const activity = within(
      screen.getByRole("group", { name: "Community activity" }),
    );
    expect(activity.getByText("Activity unavailable")).toBeTruthy();
    expect(activity.getAllByText("—")).toHaveLength(4);
  });
  it("shows counts only after the server snapshot succeeds", async () => {
    api.stats.mockResolvedValue({
      totalMembers: 12,
      onlineNow: 3,
      totalTopics: 7,
      totalPosts: 31,
      newestMember: null,
    });
    render(<Community />);
    const activity = within(
      screen.getByRole("group", { name: "Community activity" }),
    );
    await waitFor(() =>
      expect(activity.getByText("Current snapshot")).toBeTruthy(),
    );
    for (const count of ["12", "3", "7", "31"])
      expect(activity.getByText(count)).toBeTruthy();
    expect(activity.queryByText("—")).toBeNull();
  });
});
