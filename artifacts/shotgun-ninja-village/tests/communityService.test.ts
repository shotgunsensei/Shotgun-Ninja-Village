import { afterEach, describe, expect, it, vi } from "vitest";
import { communityApi, VillageApiError } from "../src/services/community";

afterEach(() => vi.unstubAllGlobals());

describe("native community client", () => {
  it("loads live categories with session credentials", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ categories: [] }), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
      );
    vi.stubGlobal("fetch", fetchMock);
    await expect(communityApi.categories()).resolves.toEqual({
      categories: [],
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/community/categories",
      expect.objectContaining({ credentials: "include" }),
    );
  });

  it("surfaces API validation messages instead of inventing successful posts", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify({ message: "Sign in to continue" }), {
            status: 401,
            headers: { "content-type": "application/json" },
          }),
        ),
    );
    await expect(
      communityApi.createTopic({
        categorySlug: "village-gate",
        title: "A valid title",
        body: "A useful opening post",
      }),
    ).rejects.toMatchObject<VillageApiError>({
      status: 401,
      message: "Sign in to continue",
    });
  });
});
