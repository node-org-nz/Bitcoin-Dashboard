const ONE_MINUTE = 60;

type CoinGeckoResponse = {
  bitcoin?: {
    usd?: number;
    usd_market_cap?: number;
    usd_24h_vol?: number;
  };
};

type GlobalMarketResponse = {
  data?: {
    market_cap_percentage?: {
      btc?: number;
    };
  };
};

type MempoolStatsResponse = {
  count: number;
  vsize: number;
};

type FeeEstimateResponse = {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
};

export type DashboardStats = {
  priceUsd: number | null;
  marketCapUsd: number | null;
  volume24hUsd: number | null;
  dominancePercent: number | null;
  mempoolCount: number | null;
  mempoolVsize: number | null;
  fastestFeeSatVb: number | null;
  halfHourFeeSatVb: number | null;
  hourFeeSatVb: number | null;
  updatedAt: string;
};

function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, {
      next: { revalidate: ONE_MINUTE },
      headers: {
        "User-Agent": "bitcoin-monitor/0.1",
      },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [marketData, globalData, mempoolData, feeData] = await Promise.all([
    fetchJson<CoinGeckoResponse>(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true"
    ),
    fetchJson<GlobalMarketResponse>("https://api.coingecko.com/api/v3/global"),
    fetchJson<MempoolStatsResponse>("https://mempool.space/api/mempool"),
    fetchJson<FeeEstimateResponse>("https://mempool.space/api/v1/fees/recommended"),
  ]);

  return {
    priceUsd: asNumber(marketData?.bitcoin?.usd),
    marketCapUsd: asNumber(marketData?.bitcoin?.usd_market_cap),
    volume24hUsd: asNumber(marketData?.bitcoin?.usd_24h_vol),
    dominancePercent: asNumber(globalData?.data?.market_cap_percentage?.btc),
    mempoolCount: asNumber(mempoolData?.count),
    mempoolVsize: asNumber(mempoolData?.vsize),
    fastestFeeSatVb: asNumber(feeData?.fastestFee),
    halfHourFeeSatVb: asNumber(feeData?.halfHourFee),
    hourFeeSatVb: asNumber(feeData?.hourFee),
    updatedAt: new Date().toISOString(),
  };
}