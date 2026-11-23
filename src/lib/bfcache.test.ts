import { describe, expect, it } from "vitest";
import { debeRecargar } from "./bfcache";

describe("debeRecargar", () => {
  it("recarga si la página se restauró desde la bfcache", () => {
    expect(debeRecargar({ persisted: true })).toBe(true);
  });

  it("no recarga en una carga normal", () => {
    expect(debeRecargar({ persisted: false })).toBe(false);
  });
});
