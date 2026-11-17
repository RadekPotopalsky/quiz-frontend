import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { getPreferences } from "../api";
import CreateQuiz from "./CreateQuiz";

jest.mock("../api", () => ({
  createQuiz: jest.fn(),
  generateQuiz: jest.fn(),
  getPreferences: jest.fn(),
  savePreferences: jest.fn()
}));

test("po potvrzení fotky z původního fotoaparátu lze hned fotit další", async () => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  sessionStorage.clear();
  getPreferences.mockResolvedValue({ default_audience: "6. třída ZŠ" });
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;
  URL.createObjectURL = jest.fn(() => "blob:preview");
  URL.revokeObjectURL = jest.fn();
  const host = document.createElement("div");
  document.body.appendChild(host);
  const root = createRoot(host);
  try {
    await act(async () => root.render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><CreateQuiz /></MemoryRouter>));
    const cameraInput = host.querySelector('input[capture="environment"]');
    expect(cameraInput).not.toBeNull();
    const photo = new File(["image"], "ucebnice.jpg", { type: "image/jpeg" });
    Object.defineProperty(cameraInput, "files", { configurable: true, value: [photo] });
    await act(async () => cameraInput.dispatchEvent(new Event("change", { bubbles: true })));
    expect(host.textContent).toContain("Fotografie (1/10)");
    expect(host.textContent).toContain("Fotit další");
    expect(host.querySelectorAll('input[capture="environment"]')).toHaveLength(2);
  } finally {
    await act(async () => root.unmount());
    host.remove();
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
    sessionStorage.clear();
  }
});
