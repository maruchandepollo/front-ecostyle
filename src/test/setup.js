import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

// Extiende Vitest con los matchers de Testing Library
expect.extend(matchers);

// Limpia el DOM después de cada test
afterEach(() => {
  cleanup();
});
