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
      className="border-4 border-black bg-white shadow-[8px_8px_0px_#000] p-8 max-w-2xl w-full"
    >
      {/* File dropzone */}
      <div
        {...getRootProps()}
        className={`border-4 border-dashed border-black p-10 text-center cursor-pointer mb-6 transition-colors
          ${
            isDragActive
              ? "bg-blue-200"
              : file
                ? "bg-blue-50"
                : "bg-white hover:bg-blue-50"
          }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <div className="text-5xl select-none">📊</div>
          {file ? (
            <div>
              <p className="font-black text-blue-600 text-lg uppercase tracking-tight">
                {file.name}
              </p>
              <p className="text-sm font-bold text-gray-500 mt-1">
                {(file.size / 1024).toFixed(1)} KB — click or drop to replace
              </p>
            </div>
          ) : (
            <div>
              <p className="font-black text-black text-lg uppercase tracking-tight">
                {isDragActive ? "Drop it here" : "Drag & drop your file"}
              </p>
              <p className="text-sm font-bold text-gray-500 mt-1">
                .csv or .xlsx — max 10 MB
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Email input */}
      <div className="mb-6">
        <label className="block font-black text-black uppercase text-xs tracking-widest mb-2">
          Recipient Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="exec@rabbitt.ai"
          required
          className="w-full border-4 border-black px-4 py-3 font-bold text-black placeholder-gray-400
                     focus:outline-none focus:bg-blue-50 bg-white shadow-[4px_4px_0px_#000]"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!file || !email || state === "loading"}
        className="w-full bg-blue-600 text-white font-black uppercase tracking-widest text-base
                   border-4 border-black py-4 shadow-[6px_6px_0px_#000]
                   hover:bg-blue-700 hover:shadow-[3px_3px_0px_#000] hover:translate-x-[3px] hover:translate-y-[3px]
                   disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-[4px_4px_0px_#000]
                   transition-all duration-100 active:shadow-none active:translate-x-[6px] active:translate-y-[6px]"
      >
        {state === "loading" ? "⏳ Generating summary..." : "Send Summary →"}
      </button>

      {/* Feedback banners */}
      {state === "success" && (
        <div className="mt-6 border-4 border-black bg-green-100 px-5 py-4 shadow-[4px_4px_0px_#000] flex items-start justify-between gap-4">
          <p className="font-black text-green-900 uppercase text-sm tracking-wide">
            ✅ {message}
          </p>
          <button
            type="button"
            onClick={reset}
            className="font-black text-xs uppercase border-2 border-black px-2 py-1 hover:bg-black hover:text-white transition-colors shrink-0"
          >
            New
          </button>
        </div>
      )}

      {state === "error" && (
        <div className="mt-6 border-4 border-black bg-red-100 px-5 py-4 shadow-[4px_4px_0px_#000] flex items-start justify-between gap-4">
          <p className="font-black text-red-900 uppercase text-sm tracking-wide">
            ❌ {message}
          </p>
          <button
            type="button"
            onClick={reset}
            className="font-black text-xs uppercase border-2 border-black px-2 py-1 hover:bg-black hover:text-white transition-colors shrink-0"
          >
            Retry
          </button>
        </div>
      )}
    </form>
  );
}
