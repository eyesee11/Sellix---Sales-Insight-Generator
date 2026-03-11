const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface UploadResult {
  ok: boolean;
  message?: string;
}

export async function uploadFile(
  file: File,
  email: string,
): Promise<UploadResult> {
  const form = new FormData();
  form.append("file", file);
  form.append("email", email);

  try {
    const res = await fetch(`${API_URL}/api/v1/upload`, {
      method: "POST",
      body: form,
    });

    const data = await res.json();

    if (!res.ok) {
      return { ok: false, message: data.detail ?? "Request failed." };
    }

    return { ok: true, message: data.message };
  } catch {
    return {
      ok: false,
      message: "Could not reach the server. Is the backend running?",
    };
  }
}
