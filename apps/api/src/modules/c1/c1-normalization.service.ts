import { Injectable } from '@nestjs/common'

export type C1TipoAtendimento =
  | 'consulta_agendada'
  | 'consulta_agendada_programada'
  | 'cuidado_continuado'
  | 'escuta_inicial'
  | 'consulta_no_dia'
  | 'atendimento_urgencia'
  | 'ignorado'

const PROGRAMADA_PATTERNS = [
  /consulta\s+agendada\s+programada/i,
  /consulta\s+agendada/i,
  /cuidado\s+continuado/i,
]

const ESPONTANEA_PATTERNS = [
  /escuta\s+inicial/i,
  /orienta[çc][ãa]o/i,
  /consulta\s+no\s+dia/i,
  /atendimento\s+(de\s+)?urg[êe]ncia/i,
  /urg[êe]ncia/i,
]

const IGNORAR_PATTERNS = [/n[ãa]o\s+informad[oa]/i]

@Injectable()
export class C1NormalizationService {
  normalize(raw: string): C1TipoAtendimento {
    const s = raw.trim()

    if (IGNORAR_PATTERNS.some((re) => re.test(s))) return 'ignorado'

    if (PROGRAMADA_PATTERNS[0].test(s)) return 'consulta_agendada_programada'
    if (PROGRAMADA_PATTERNS[1].test(s)) return 'consulta_agendada'
    if (PROGRAMADA_PATTERNS[2].test(s)) return 'cuidado_continuado'

    if (ESPONTANEA_PATTERNS[0].test(s) || ESPONTANEA_PATTERNS[1].test(s)) return 'escuta_inicial'
    if (ESPONTANEA_PATTERNS[2].test(s)) return 'consulta_no_dia'
    if (ESPONTANEA_PATTERNS[3].test(s) || ESPONTANEA_PATTERNS[4].test(s))
      return 'atendimento_urgencia'

    return 'ignorado'
  }

  isProgramada(tipo: C1TipoAtendimento): boolean {
    return (
      tipo === 'consulta_agendada' ||
      tipo === 'consulta_agendada_programada' ||
      tipo === 'cuidado_continuado'
    )
  }

  isEspontanea(tipo: C1TipoAtendimento): boolean {
    return (
      tipo === 'escuta_inicial' || tipo === 'consulta_no_dia' || tipo === 'atendimento_urgencia'
    )
  }
}
