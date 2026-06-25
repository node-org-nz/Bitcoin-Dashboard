import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "David",
  description: "A simple hello for David.",
};

export default function DavidPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 text-center">
      <h1 className="text-5xl font-bold tracking-tight text-[var(--foreground)] sm:text-7xl">
        Hi David.
      </h1>
    </main>
  );
}
