import UploadForm from "./UploadForm";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b-4 border-black bg-blue-600 px-6 py-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white uppercase leading-none">
              Sales Insight Automator
            </h1>
            <p className="text-blue-100 text-sm font-bold mt-1">
              Rabbitt AI — Internal Sprint Tool
            </p>
          </div>
          <div className="bg-white border-2 border-black px-3 py-1 shadow-[3px_3px_0px_#000]">
            <span className="text-xs font-black text-blue-600 uppercase tracking-widest">
              Powered by Gemini
            </span>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        <div className="mb-10">
          <h2 className="text-5xl font-black text-black uppercase tracking-tight leading-none mb-4">
            Upload.
            <br />
            Analyze.
            <br />
            Deliver.
          </h2>
          <p className="text-gray-700 font-medium text-lg max-w-lg">
            Drop your Q1 sales CSV or Excel file, enter a recipient email, and
            get a clean executive summary straight to the inbox.
          </p>

          {/* Feature chips */}
          <div className="flex flex-wrap gap-3 mt-6">
            {["CSV & XLSX", "AI Summary", "Email Delivery", "10 MB Max"].map(
              (tag) => (
                <span
                  key={tag}
                  className="border-2 border-black px-3 py-1 text-xs font-black uppercase tracking-widest shadow-[3px_3px_0px_#000] bg-blue-50"
                >
                  {tag}
                </span>
              ),
            )}
          </div>
        </div>

        <UploadForm />
      </div>

      {/* Footer */}
      <footer className="border-t-4 border-black py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <p className="text-xs font-black text-gray-500 uppercase tracking-widest">
            Rabbitt AI Internal Tools — Q1 2026
          </p>
          <a
            href="/api/docs"
            className="text-xs font-black uppercase tracking-widest border-2 border-black px-2 py-1 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors"
          >
            API Docs ↗
          </a>
        </div>
      </footer>
    </main>
  );
}
