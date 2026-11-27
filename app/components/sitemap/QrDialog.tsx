"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { copyText } from "@/app/components/calculator/ui";
import { CheckIcon, CloseIcon, DownloadIcon, LinkIcon } from "./icons";

export type QrTarget = { title: string; url: string };

/** PNG data URL -> Blob, without fetch (so it also works offline and keeps the click "user gesture" for Safari). */
function dataUrlToBlob(dataUrl: string): Blob {
  const [head, body] = dataUrl.split(",");
  const mime = /data:([^;]+)/.exec(head)?.[1] ?? "image/png";
  const bytes = Uint8Array.from(atob(body), (c) => c.charCodeAt(0));
  return new Blob([bytes], { type: mime });
}

async function copyImage(dataUrl: string): Promise<boolean> {
  try {
    if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") return false;
    await navigator.clipboard.write([new ClipboardItem({ "image/png": dataUrlToBlob(dataUrl) })]);
    return true;
  } catch {
    return false;
  }
}

const fileName = (url: string) =>
  `qr-${url.replace(/^https?:\/\//, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "site"}.png`;

type Note = "" | "image" | "link" | "downloaded" | "image-failed" | "link-failed";

type BodyProps = { target: QrTarget; onRequestClose: () => void };

/** Dialog content. It is re-created for every link (key), so the image and the note always start empty. */
function QrBody({ target, onRequestClose }: BodyProps) {
  const [png, setPng] = useState("");
  const [note, setNote] = useState<Note>("");

  // Make the QR image for this link.
  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(target.url, {
      width: 720,
      margin: 2,
      errorCorrectionLevel: "M",
      color: { dark: "#0B3D2E", light: "#FFFFFF" },
    })
      .then((data) => {
        if (!cancelled) setPng(data);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [target.url]);

  const download = () => {
    if (!png) return;
    const a = document.createElement("a");
    a.href = png;
    a.download = fileName(target.url);
    document.body.appendChild(a);
    a.click();
    a.remove();
    setNote("downloaded");
  };

  const copyQr = async () => {
    if (!png) return;
    if (await copyImage(png)) setNote("image");
    else {
      // This browser cannot copy images: save the file instead.
      download();
      setNote("image-failed");
    }
  };

  const copyLink = async () => {
    setNote((await copyText(target.url)) ? "link" : "link-failed");
  };

  const message: Record<Note, string> = {
    "": "",
    image: "QR code copied. Paste it into a chat or document.",
    link: "Link copied.",
    downloaded: "QR code saved as a PNG file.",
    "image-failed": "Your browser cannot copy images, so the QR code was saved as a file instead.",
    "link-failed": "Your browser blocked copying. Select the link above and copy it by hand.",
  };

  return (
    <div className="qr-body">
      <div className="qr-head">
        <div>
          <p className="qr-eyebrow">QR code</p>
          <h2 id="qr-title">{target.title}</h2>
        </div>
        <button type="button" className="qr-close" onClick={onRequestClose} aria-label="Close">
          <CloseIcon />
        </button>
      </div>

      <div className="qr-frame">
        {png ? (
          // eslint-disable-next-line @next/next/no-img-element -- data URL made in the browser
          <img src={png} alt={`QR code for ${target.url}`} width={260} height={260} />
        ) : (
          <span className="qr-loading" role="status">
            Making QR code…
          </span>
        )}
      </div>

      <p className="qr-url">{target.url}</p>

      <div className="qr-actions">
        <button type="button" className="sm-btn sm-btn-primary" onClick={copyQr} disabled={!png}>
          {note === "image" ? <CheckIcon /> : null}
          Copy QR image
        </button>
        <button type="button" className="sm-btn" onClick={download} disabled={!png}>
          <DownloadIcon />
          Download PNG
        </button>
        <button type="button" className="sm-btn" onClick={copyLink}>
          {note === "link" ? <CheckIcon /> : <LinkIcon />}
          Copy link
        </button>
      </div>
      <p className="qr-note" role="status" aria-live="polite">
        {message[note]}
      </p>
    </div>
  );
}

/**
 * QR code for a page link, in a native <dialog> (focus trap, Esc to close and the backdrop come from the browser).
 * The QR is made in the browser from the link, so nothing is sent anywhere.
 */
export default function QrDialog({ target, onClose }: { target: QrTarget | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  // Open / close the dialog with the target.
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (target && !dialog.open) dialog.showModal();
    if (!target && dialog.open) dialog.close();
  }, [target]);

  return (
    <dialog
      ref={ref}
      className="qr-dialog"
      aria-labelledby="qr-title"
      onClose={onClose}
      onClick={(e) => {
        // A click on the dark backdrop (the dialog element itself) closes it.
        if (e.target === ref.current) ref.current?.close();
      }}
    >
      {target && <QrBody key={target.url} target={target} onRequestClose={() => ref.current?.close()} />}
    </dialog>
  );
}
