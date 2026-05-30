import type { C7CriterionId, C7EligibilityResult } from '@repo/types'

export const C7_ELIGIBILITY_RANGES: Record<C7CriterionId, { minAge: number; maxAge: number }> = {
  A: { minAge: 25, maxAge: 64 },
  B: { minAge: 9, maxAge: 14 },
  C: { minAge: 14, maxAge: 69 },
  D: { minAge: 50, maxAge: 69 },
}

const C7_CRITERION_POINTS: Record<C7CriterionId, number> = {
  A: 20,
  B: 30,
  C: 30,
  D: 20,
}

export function checkEligibility(age: number): C7EligibilityResult {
  return (
    Object.entries(C7_ELIGIBILITY_RANGES) as [C7CriterionId, { minAge: number; maxAge: number }][]
  ).reduce(
    (acc, [id, range]) => ({ ...acc, [id]: age >= range.minAge && age <= range.maxAge }),
    {} as C7EligibilityResult,
  )
}

export function getMaxPoints(eligibility: C7EligibilityResult): number {
  return (Object.entries(C7_CRITERION_POINTS) as [C7CriterionId, number][]).reduce(
    (sum, [id, pts]) => (eligibility[id] ? sum + pts : sum),
    0,
  )
}

export function calcAge(birthDate: string): number {
  const birth = new Date(birthDate)
  const today = new Date()
  const age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  return m < 0 || (m === 0 && today.getDate() < birth.getDate()) ? age - 1 : age
}
