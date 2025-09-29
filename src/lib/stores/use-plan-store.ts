import { create } from 'zustand'

type PlanType = 'FREE' | 'PRO'

interface PlanState {
  plan: PlanType
  setPlan: (plan: PlanType) => void
}

export const usePlanStore = create<PlanState>((set) => ({
  plan: 'FREE',
  setPlan: (plan) => set({ plan }),
}))
