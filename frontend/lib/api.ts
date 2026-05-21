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

  // Helper to extract access_token from cookie
  const getCookie = (name: string) => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
  };

  const token = getCookie("access_token");

  try {
    const res = await fetch(`${API_URL}/api/v1/upload`, {
      method: "POST",
      headers: {
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
      },
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
