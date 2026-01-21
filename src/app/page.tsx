import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white gap-6">
      <h1 className="text-4xl font-bold">NEUROPATH AI</h1>

      <p className="text-zinc-400">
        Emotion-adaptive personalized education platform
      </p>

      <div className="flex gap-4">
        <Link
          href="/tutor"
          className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Open Tutor
        </Link>

        <Link
          href="/dashboard"
          className="px-6 py-3 border border-zinc-700 rounded-lg hover:bg-zinc-900"
        >
          Dashboard
        </Link>
      </div>
    </main>
  );
}
