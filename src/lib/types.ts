export interface Campaign {
  id: string
  title: string
  description: string
  image: string
  goal: number
  raised: number
  daysLeft: number
  creator: string
  category: string
  status: "active" | "completed" | "expired"
}

export interface Supporter {
  id: string
  walletAddress: string
  amount: number
  date: string
  campaignId: string
  campaignTitle: string
}
