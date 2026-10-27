import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { GameLink } from "@/components/shared/GameLink";
import { GameSection } from "@/components/shared/GameSection";

afterEach(() => cleanup());

describe("approved game website destination", () => {
  it("uses the owner-specified address with safe external navigation and honest wording", () => {
    render(<GameLink />);
    const link = screen.getByRole("link", { name: /Visit game website/ });
    expect(link.getAttribute("href")).toBe("https://kage.operatoros.net");
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    expect(link.textContent).toMatch(/game website; opens in a new tab/);
    expect(screen.queryByRole("link", { name: /play now/i })).toBeNull();
  });

  it("can close the mobile navigation when the destination is selected", () => {
    const onNavigate = vi.fn();
    render(<GameLink onClick={onNavigate}>Shotgun Ninjas Game</GameLink>);
    fireEvent.click(screen.getByRole("link", { name: /Shotgun Ninjas Game/ }));
    expect(onNavigate).toHaveBeenCalledOnce();
  });

  it("presents a labeled game section without claiming a verified public game", () => {
    render(<GameSection />);
    expect(
      screen.getByRole("region", { name: /Kage-9's next chapter/ }),
    ).toBeTruthy();
    expect(screen.getByText("Game website")).toBeTruthy();
    expect(screen.queryByText(/launch pending/i)).toBeNull();
    expect(screen.queryByText(/verified gameplay|fps/i)).toBeNull();
    expect(screen.getByRole("img").getAttribute("alt")).toMatch(
      /character concept/,
    );
    expect(
      screen
        .getByRole("link", { name: /Visit game website/ })
        .getAttribute("href"),
    ).toBe("https://kage.operatoros.net");
  });
});
