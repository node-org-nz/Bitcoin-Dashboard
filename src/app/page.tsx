import { getDashboardStats } from "@/lib/bitcoin";

function formatCurrency(value: number | null): string {
  if (value === null) {
    return "Unavailable";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number | null): string {
  if (value === null) {
    return "Unavailable";
  }

  return new Intl.NumberFormat("en-US").format(value);
}

function formatPercent(value: number | null): string {
  if (value === null) {
    return "Unavailable";
  }

  return `${value.toFixed(2)}%`;
}

function formatUpdatedAt(isoDate: string): string {
  return new Date(isoDate).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "medium",
  });
}

type StatCardProps = {
  label: string;
  value: string;
  detail?: string;
};

function StatCard({ label, value, detail }: StatCardProps) {
  return (
    <article className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] p-5 shadow-sm">
      <p className="text-xs uppercase tracking-[0.08em] text-[var(--muted)]">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-[var(--foreground)]">{value}</p>
      {detail ? <p className="mt-2 text-sm text-[var(--muted)]">{detail}</p> : null}
    </article>
  );
}

export default async function Home() {
  const stats = await getDashboardStats();

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <main className="mx-auto max-w-6xl px-6 py-10 sm:px-10">
        <header className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
            Monitoring The Situation
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Bitcoin Situation Room</h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-[var(--muted)] sm:text-base">
            Live dashboard fed by public APIs. Data refreshes roughly once per minute and gracefully degrades when an endpoint is unavailable.
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.08em] text-[var(--muted)]">
            Last update: {formatUpdatedAt(stats.updatedAt)}
          </p>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label="BTC Price" value={formatCurrency(stats.priceUsd)} />
          <StatCard label="Market Cap" value={formatCurrency(stats.marketCapUsd)} />
          <StatCard label="24h Volume" value={formatCurrency(stats.volume24hUsd)} />
          <StatCard label="BTC Dominance" value={formatPercent(stats.dominancePercent)} detail="Share of total crypto market cap" />
          <StatCard label="Mempool Tx Count" value={formatNumber(stats.mempoolCount)} />
          <StatCard label="Mempool vSize" value={formatNumber(stats.mempoolVsize)} detail="Virtual bytes waiting for confirmation" />
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <StatCard label="Fastest Fee" value={stats.fastestFeeSatVb === null ? "Unavailable" : `${stats.fastestFeeSatVb} sat/vB`} />
          <StatCard label="30m Fee" value={stats.halfHourFeeSatVb === null ? "Unavailable" : `${stats.halfHourFeeSatVb} sat/vB`} />
          <StatCard label="60m Fee" value={stats.hourFeeSatVb === null ? "Unavailable" : `${stats.hourFeeSatVb} sat/vB`} />
        </section>
      </main>
    </div>
  );
}