"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { uploadFile } from "./lib/api";

type UIState = "idle" | "loading" | "success" | "error";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<UIState>("idle");
  const [message, setMessage] = useState("");

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !email) return;
    setState("loading");
    setMessage("");
    const result = await uploadFile(file, email);
    if (result.ok) {
      setState("success");
      setMessage(result.message ?? "Summary sent! Check your inbox.");
      setFile(null);
      setEmail("");
    } else {
      setState("error");
      setMessage(result.message ?? "Something went wrong. Try again.");
    }
  };

  const reset = () => {
    setState("idle");
    setMessage("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-2 border-ink bg-white shadow-brutal-xl"
    >
      {/* Form header bar */}
      <div className="bg-ink px-6 py-3 flex items-center justify-between">
        <span className="text-[11px] font-black uppercase tracking-wide2 text-white/60">
          Sales file upload
        </span>
        <span className="text-[10px] font-bold uppercase tracking-swiss text-white/40">
          .csv · .xlsx · max 10 mb
        </span>
      </div>

      <div className="p-6 space-y-5">
        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-100
            ${
              isDragActive
                ? "border-accent bg-accent-light"
                : file
                  ? "border-accent bg-accent-light/40"
                  : "border-ink/30 bg-paper hover:border-accent hover:bg-accent-light/20"
            }`}
        >
          <input {...getInputProps()} />
          <div className="space-y-2">
            <div className="text-4xl select-none">
              {file ? "📊" : isDragActive ? "📥" : "📁"}
            </div>
            {file ? (
              <div>
                <p className="font-black text-accent text-sm uppercase tracking-tight">
                  {file.name}
                </p>
                <p className="text-xs font-bold text-gray-400 mt-1">
                  {(file.size / 1024).toFixed(1)} KB — click or drop to replace
                </p>
              </div>
            ) : (
              <div>
                <p className="font-black text-ink text-sm uppercase tracking-tight">
                  {isDragActive
                    ? "Drop it. Right now."
                    : "Drag & drop your file"}
                </p>
                <p className="text-xs font-bold text-gray-400 mt-1">
                  or click to browse
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Email input */}
        <div>
          <label className="block font-black text-ink uppercase text-[10px] tracking-wide2 mb-2">
            Recipient Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="exec@rabbitt.ai"
            required
            className="w-full border-2 border-ink px-4 py-3 text-sm font-medium text-ink placeholder-gray-300
                       focus:outline-none focus:border-accent focus:bg-accent-light/20 bg-paper transition-colors"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!file || !email || state === "loading"}
          className="w-full bg-accent text-white font-black uppercase tracking-swiss text-sm
                     border-2 border-ink py-4 shadow-brutal-lg
                     hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px]
                     disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-brutal disabled:translate-x-0 disabled:translate-y-0
                     transition-all duration-100"
        >
          {state === "loading" ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating summary…
            </span>
          ) : (
            "Analyse & Send →"
          )}
        </button>

        {/* Feedback */}
        {state === "success" && (
          <div className="border-2 border-ink bg-green-50 px-4 py-4 shadow-brutal flex items-start justify-between gap-4">
            <div>
              <p className="font-black text-green-900 uppercase text-xs tracking-swiss">
                ✅ Done!
              </p>
              <p className="text-xs font-medium text-green-800 mt-0.5">
                {message}
              </p>
            </div>
            <button
              type="button"
              onClick={reset}
              className="font-black text-[10px] uppercase tracking-swiss border-2 border-ink px-2 py-1
                         hover:bg-ink hover:text-white transition-colors shrink-0"
            >
              New
            </button>
          </div>
        )}

        {state === "error" && (
          <div className="border-2 border-ink bg-red-50 px-4 py-4 shadow-brutal flex items-start justify-between gap-4">
            <div>
              <p className="font-black text-red-900 uppercase text-xs tracking-swiss">
                ❌ Error
              </p>
              <p className="text-xs font-medium text-red-800 mt-0.5">
                {message}
              </p>
            </div>
            <button
              type="button"
              onClick={reset}
              className="font-black text-[10px] uppercase tracking-swiss border-2 border-ink px-2 py-1
                         hover:bg-ink hover:text-white transition-colors shrink-0"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </form>
  );
}
