import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common'
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'

import { ApiConfigService } from '../../config/api-config.service'

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name)
  private readonly client: S3Client | null
  private readonly bucket: string | undefined

  constructor(config: ApiConfigService) {
    if (!config.isR2Configured) {
      this.logger.warn('R2 storage is not configured - file uploads will be rejected.')
      this.client = null
      this.bucket = undefined
      return
    }
    this.bucket = config.r2Bucket
    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${config.r2AccountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.r2AccessKeyId as string,
        secretAccessKey: config.r2SecretAccessKey as string,
      },
    })
  }

  private requireClient(): { client: S3Client; bucket: string } {
    if (!this.client || !this.bucket) {
      throw new ServiceUnavailableException(
        'Armazenamento R2 não configurado. Defina R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY e R2_BUCKET.',
      )
    }
    return { client: this.client, bucket: this.bucket }
  }

  async put(key: string, body: Buffer, contentType: string): Promise<void> {
    const { client, bucket } = this.requireClient()
    await client.send(
      new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType }),
    )
    this.logger.log(`Uploaded ${key} (${body.length} bytes)`)
  }

  async getBuffer(key: string): Promise<Buffer> {
    const { client, bucket } = this.requireClient()
    const result = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }))
    if (!result.Body) throw new Error(`Empty body for ${key}`)
    const chunks: Uint8Array[] = []
    for await (const chunk of result.Body as AsyncIterable<Uint8Array>) chunks.push(chunk)
    return Buffer.concat(chunks)
  }

  async delete(key: string): Promise<void> {
    const { client, bucket } = this.requireClient()
    await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
    this.logger.log(`Deleted ${key}`)
  }
}
