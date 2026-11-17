import React, { useEffect, useRef, useState } from "react";

export default function CameraCapture({ onAccept, onClose, remaining }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const activeRef = useRef(true);
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    activeRef.current = true;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Tento prohlížeč nepodporuje focení přímo ve stránce.");
    } else {
      navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: { ideal: "environment" }, width: { ideal: 3000 }, height: { ideal: 3000 } }
      }).then(stream => {
        if (!activeRef.current) { stream.getTracks().forEach(track => track.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => setError("Náhled fotoaparátu se nepodařilo spustit."));
        }
      }).catch(() => setError("Fotoaparát se nepodařilo otevřít. Povol přístup ke kameře, nebo použij systémový fotoaparát."));
    }
    return () => {
      activeRef.current = false;
      streamRef.current?.getTracks().forEach(track => track.stop());
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  useEffect(() => () => { if (photo?.url) URL.revokeObjectURL(photo.url); }, [photo]);

  const capture = () => {
    const video = videoRef.current;
    if (!video?.videoWidth || !video?.videoHeight) { setError("Počkej, až se zobrazí obraz fotoaparátu."); return; }
    const scale = Math.min(1, 3000 / Math.max(video.videoWidth, video.videoHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(blob => {
      if (!activeRef.current) return;
      if (!blob) { setError("Fotku se nepodařilo uložit. Zkus to znovu."); return; }
      const file = new File([blob], `ucebnice-${Date.now()}.jpg`, { type: "image/jpeg" });
      setPhoto({ file, url: URL.createObjectURL(blob) });
      setError("");
    }, "image/jpeg", 0.9);
  };

  const accept = (another) => {
    if (!photo) return;
    if (!onAccept(photo.file)) { setError("Fotku se nepodařilo přidat. Zkontroluj počet a velikost fotografií."); return; }
    if (another && remaining > 1) setPhoto(null);
    else onClose();
  };

  return <div className="camera-overlay" role="dialog" aria-modal="true" aria-label="Fotit stránky učebnice">
    <div className="camera-dialog">
      <div className="camera-header"><div><strong>Fotit stránky učebnice</strong><span>Ještě můžeš přidat {remaining} fotek.</span></div>
        <button type="button" className="camera-close" onClick={onClose} aria-label="Zavřít fotoaparát">×</button></div>
      <div className="camera-preview"><video ref={videoRef} autoPlay playsInline muted />
        {photo && <img src={photo.url} alt="Právě vyfocená stránka" />}</div>
      {error && <p className="error" role="alert">{error}</p>}
      <div className="camera-actions">{photo ? <>
        <button type="button" className="button secondary" onClick={() => setPhoto(null)}>Opakovat</button>
        <button type="button" className="button secondary" onClick={() => accept(false)}>OK</button>
        <button type="button" className="button primary" onClick={() => accept(true)} disabled={remaining <= 1} title="Vložit fotku a hned fotit další" aria-label="OK plus: vložit fotku a hned fotit další">OK +</button>
      </> : <button type="button" className="button primary" onClick={capture} disabled={!!error && !streamRef.current}>Vyfotit</button>}</div>
      {photo && <p className="camera-hint">OK + vloží fotku a nechá fotoaparát otevřený pro další stránku.</p>}
      {error && <label className="button secondary upload-button camera-fallback">Otevřít systémový fotoaparát
        <input type="file" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={event => {
          const file = event.target.files?.[0];
          if (file && onAccept(file)) onClose();
          event.target.value = "";
        }} /></label>}
    </div>
  </div>;
}
