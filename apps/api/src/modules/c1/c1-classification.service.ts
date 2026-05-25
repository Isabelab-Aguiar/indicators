import { Injectable } from '@nestjs/common'
import type { C1Classificacao } from '../../database/schema/c1.schema'
import { C1_THRESHOLDS } from './c1.constants'

export interface C1ClassificationResult {
  classificacao: C1Classificacao
  alerta: string | null
}

@Injectable()
export class C1ClassificationService {
  classify(percentual: number): C1ClassificationResult {
    return {
      classificacao: this.resolveClassificacao(percentual),
      alerta: this.resolveAlerta(percentual),
    }
  }

  private resolveClassificacao(p: number): C1Classificacao {
    if (p > C1_THRESHOLDS.OTIMO_MIN && p <= C1_THRESHOLDS.OTIMO_MAX) return 'otimo'
    if (p > C1_THRESHOLDS.BOM_MIN && p <= C1_THRESHOLDS.BOM_MAX) return 'bom'
    if (p > C1_THRESHOLDS.SUFICIENTE_MIN && p <= C1_THRESHOLDS.SUFICIENTE_MAX) return 'suficiente'
    return 'regular'
  }

  private resolveAlerta(p: number): string | null {
    if (p > C1_THRESHOLDS.ALERTA_ACIMA) return 'acima_70'
    if (p <= C1_THRESHOLDS.ALERTA_ABAIXO) return 'abaixo_10'
    return null
  }
}
