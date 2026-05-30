import { Injectable } from '@nestjs/common'
import type { C7CriterionId, C7EligibilityResult } from '@repo/types'
import { C7_CRITERION_POINTS, C7_ELIGIBILITY_RANGES } from './c7.constants'

@Injectable()
export class C7EligibilityService {
  checkEligibility(age: number): C7EligibilityResult {
    return (
      Object.entries(C7_ELIGIBILITY_RANGES) as [C7CriterionId, { minAge: number; maxAge: number }][]
    ).reduce(
      (acc, [id, range]) => ({ ...acc, [id]: age >= range.minAge && age <= range.maxAge }),
      {} as C7EligibilityResult,
    )
  }

  getMaxPoints(eligibility: C7EligibilityResult): number {
    return (Object.entries(C7_CRITERION_POINTS) as [C7CriterionId, number][]).reduce(
      (sum, [id, pts]) => (eligibility[id] ? sum + pts : sum),
      0,
    )
  }

  calcAge(birthDate: string): number {
    const birth = new Date(birthDate)
    const today = new Date()
    const age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    return m < 0 || (m === 0 && today.getDate() < birth.getDate()) ? age - 1 : age
  }
}
