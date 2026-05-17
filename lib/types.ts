export interface Payment {
  id: string;
  bot_name: string;
  user_agent: string;
  page_url: string;
  amount_usdc: number;
  tx_hash: string;
  created_at: string;
}

export type ChartDay = {
  label: string;
  revenue: number;
};

export interface GatewayBalance {
  total: string;
  available: string;
  withdrawing: string;
}
