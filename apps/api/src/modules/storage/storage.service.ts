import { Injectable, Logger } from '@nestjs/common'
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
  private readonly client: S3Client
  private readonly bucket: string

  constructor(config: ApiConfigService) {
    this.bucket = config.r2Bucket
    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${config.r2AccountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.r2AccessKeyId,
        secretAccessKey: config.r2SecretAccessKey,
      },
    })
  }

  async put(key: string, body: Buffer, contentType: string): Promise<void> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    )
    this.logger.log(`Uploaded ${key} (${body.length} bytes)`)
  }

  async getBuffer(key: string): Promise<Buffer> {
    const result = await this.client.send(new GetObjectCommand({ Bucket: this.bucket, Key: key }))
    if (!result.Body) throw new Error(`Empty body for ${key}`)
    const chunks: Uint8Array[] = []
    for await (const chunk of result.Body as AsyncIterable<Uint8Array>) chunks.push(chunk)
    return Buffer.concat(chunks)
  }

  async delete(key: string): Promise<void> {
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }))
    this.logger.log(`Deleted ${key}`)
  }
}
