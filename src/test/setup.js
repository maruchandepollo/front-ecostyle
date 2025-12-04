import { expect, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import "@testing-library/jest-dom";

// Extiende Vitest con los matchers de Testing Library
expect.extend(matchers);

// Limpia el DOM después de cada test
afterEach(() => {
  cleanup();
});
