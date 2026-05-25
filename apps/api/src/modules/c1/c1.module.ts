import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'

import { C1Controller } from './c1.controller'
import { C1Service } from './c1.service'
import { C1ImportProcessor } from './c1-import.processor'
import { C1CalculatorService } from './c1-calculator.service'
import { C1ClassificationService } from './c1-classification.service'
import { C1NormalizationService } from './c1-normalization.service'
import { C1PdfParserService } from './c1-pdf-parser.service'
import { C1ConsolidationService } from './c1-consolidation.service'
import { C1AnalyticsService } from './c1-analytics.service'
import { QUEUE_NAMES } from '@repo/config'

@Module({
  imports: [BullModule.registerQueue({ name: QUEUE_NAMES.C1_PDF_IMPORT })],
  controllers: [C1Controller],
  providers: [
    C1Service,
    C1ImportProcessor,
    C1CalculatorService,
    C1ClassificationService,
    C1NormalizationService,
    C1PdfParserService,
    C1ConsolidationService,
    C1AnalyticsService,
  ],
})
export class C1Module {}
