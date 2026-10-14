import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import Legal from "@/pages/Legal";
import { isLiveStore } from "@/config/integrations";

const route = vi.hoisted(() => ({ section: "refunds" }));
vi.mock("@/config/integrations", () => ({ isLiveStore: vi.fn(() => false) }));
vi.mock("@workspace/sn-ecosystem", () => ({ UniverseFooter: () => null }));
vi.mock("@/components/shared/NextWaypoint", () => ({
  NextWaypoint: () => null,
}));
vi.mock("wouter", async (importOriginal) => ({
  ...(await importOriginal<typeof import("wouter")>()),
  useRoute: () => [true, { section: route.section }],
}));

beforeEach(() => {
  route.section = "refunds";
  vi.mocked(isLiveStore).mockReturnValue(false);
});
afterEach(() => cleanup());

describe("legal pages respect the closed concept catalog", () => {
  it("does not present unverified manufacturing, returns or shipping promises in preview", () => {
    render(<Legal />);
    expect(
      screen.getByRole("heading", { name: "Merch is not open for orders" }),
    ).toBeTruthy();
    expect(screen.queryByText(/Orders enter production/)).toBeNull();
    expect(screen.queryByText(/within 30 days/)).toBeNull();
    expect(
      screen.queryByText(/International shipping is available/),
    ).toBeNull();
  });

  it("does not claim a fulfillment partner or final-sale drops in preview terms", () => {
    route.section = "terms";
    render(<Legal />);
    expect(screen.getByText(/not accepting orders/)).toBeTruthy();
    expect(
      screen.queryByText(/fulfilled through our partner storefront/),
    ).toBeNull();
    expect(screen.queryByText(/may be non-refundable/)).toBeNull();
  });

  it("retains existing live refund policy content without rewriting commitments", () => {
    vi.mocked(isLiveStore).mockReturnValue(true);
    render(<Legal />);
    expect(screen.getByText(/Orders enter production/)).toBeTruthy();
    expect(screen.getByText(/within 30 days/)).toBeTruthy();
    expect(
      screen.queryByRole("heading", { name: "Merch is not open for orders" }),
    ).toBeNull();
  });

  it("retains existing live purchase terms", () => {
    route.section = "terms";
    vi.mocked(isLiveStore).mockReturnValue(true);
    render(<Legal />);
    expect(
      screen.getByText(/fulfilled through our partner storefront/),
    ).toBeTruthy();
    expect(
      screen.queryByRole("heading", { name: "Merch is not open for orders" }),
    ).toBeNull();
  });
});
