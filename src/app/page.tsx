import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-indigo-400">
          Student Portal
        </h1>
        <p className="text-slate-400 text-lg">
          Welcome to OnyxStack Labs Enterprise SaaS Platform.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link
            href="/login"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium transition"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 border border-slate-700 hover:bg-slate-900 rounded-lg font-medium transition"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}
