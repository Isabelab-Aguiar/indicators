import type { IndicatorCode, IndicatorDefinition } from '../types'

import { C1 } from './c1'
import { C2 } from './c2'
import { C3 } from './c3'
import { C4 } from './c4'
import { C5 } from './c5'
import { C6 } from './c6'
import { C7 } from './c7'

export const INDICATORS: Record<IndicatorCode, IndicatorDefinition> = {
  c1: C1,
  c2: C2,
  c3: C3,
  c4: C4,
  c5: C5,
  c6: C6,
  c7: C7,
}

export const INDICATOR_LIST: IndicatorDefinition[] = [C1, C2, C3, C4, C5, C6, C7]
