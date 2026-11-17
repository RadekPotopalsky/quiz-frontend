import React, { act } from "react";
import { createRoot } from "react-dom/client";
import CameraCapture from "./CameraCapture";

test("Opakovat, OK a OK plus zachovají správný postup focení", async () => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  const originalMediaDevices = navigator.mediaDevices;
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;
  const originalPlay = HTMLMediaElement.prototype.play;
  const originalGetContext = HTMLCanvasElement.prototype.getContext;
  const originalToBlob = HTMLCanvasElement.prototype.toBlob;
  const originalVideoWidth = Object.getOwnPropertyDescriptor(HTMLVideoElement.prototype, "videoWidth");
  const originalVideoHeight = Object.getOwnPropertyDescriptor(HTMLVideoElement.prototype, "videoHeight");
  const stop = jest.fn();
  const onAccept = jest.fn(() => true);
  const onClose = jest.fn();
  const host = document.createElement("div");
  document.body.appendChild(host);
  const root = createRoot(host);
  try {
    Object.defineProperty(navigator, "mediaDevices", { configurable: true, value: {
      getUserMedia: jest.fn(async () => ({ getTracks: () => [{ stop }] }))
    } });
    URL.createObjectURL = jest.fn(() => "blob:test-photo");
    URL.revokeObjectURL = jest.fn();
    HTMLMediaElement.prototype.play = jest.fn(async () => {});
    HTMLCanvasElement.prototype.getContext = jest.fn(() => ({ drawImage: jest.fn() }));
    HTMLCanvasElement.prototype.toBlob = jest.fn(callback => callback(new Blob(["photo"], { type: "image/jpeg" })));
    Object.defineProperty(HTMLVideoElement.prototype, "videoWidth", { configurable: true, value: 1000 });
    Object.defineProperty(HTMLVideoElement.prototype, "videoHeight", { configurable: true, value: 1400 });

    await act(async () => root.render(<CameraCapture onAccept={onAccept} onClose={onClose} remaining={3} />));
    await act(async () => host.querySelector(".camera-actions button").click());
    expect(host.querySelector('img[alt="Právě vyfocená stránka"]')).not.toBeNull();

    await act(async () => host.querySelector('button[aria-label^="OK plus"]').click());
    expect(onAccept).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
    expect(host.querySelector('img[alt="Právě vyfocená stránka"]')).toBeNull();
    expect(host.querySelector(".camera-actions button").textContent).toBe("Vyfotit");
    expect(stop).not.toHaveBeenCalled();

    await act(async () => host.querySelector(".camera-actions button").click());
    await act(async () => Array.from(host.querySelectorAll(".camera-actions button")).find(button => button.textContent === "Opakovat").click());
    expect(onAccept).toHaveBeenCalledTimes(1);
    expect(host.querySelector('img[alt="Právě vyfocená stránka"]')).toBeNull();

    await act(async () => host.querySelector(".camera-actions button").click());
    await act(async () => Array.from(host.querySelectorAll(".camera-actions button")).find(button => button.textContent === "OK").click());
    expect(onAccept).toHaveBeenCalledTimes(2);
    expect(onClose).toHaveBeenCalledTimes(1);
  } finally {
    await act(async () => root.unmount());
    host.remove();
    Object.defineProperty(navigator, "mediaDevices", { configurable: true, value: originalMediaDevices });
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
    HTMLMediaElement.prototype.play = originalPlay;
    HTMLCanvasElement.prototype.getContext = originalGetContext;
    HTMLCanvasElement.prototype.toBlob = originalToBlob;
    if (originalVideoWidth) Object.defineProperty(HTMLVideoElement.prototype, "videoWidth", originalVideoWidth);
    else delete HTMLVideoElement.prototype.videoWidth;
    if (originalVideoHeight) Object.defineProperty(HTMLVideoElement.prototype, "videoHeight", originalVideoHeight);
    else delete HTMLVideoElement.prototype.videoHeight;
  }
  expect(stop).toHaveBeenCalled();
});
