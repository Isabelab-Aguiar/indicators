import { Injectable } from '@nestjs/common'

export interface C1Input {
  programada: number
  espontanea: number
}

export interface C1Result {
  programada: number
  espontanea: number
  total: number
  percentual: number
}

@Injectable()
export class C1CalculatorService {
  calculate(input: C1Input): C1Result {
    const total = input.programada + input.espontanea
    const percentual = total === 0 ? 0 : (input.programada / total) * 100
    return {
      programada: input.programada,
      espontanea: input.espontanea,
      total,
      percentual: Math.round(percentual * 100) / 100,
    }
  }
}
