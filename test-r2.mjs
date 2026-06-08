import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://4631f6978398f0281de536f6ba92e45a.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: 'd6d74905bbb873ae28f48c5425ad9d11',
    secretAccessKey: '7fdda4e79346d6417a02278430eed0f836554e49849db325efd93d5d970087d1',
  },
});

const command = new PutObjectCommand({
  Bucket: 'imoob',
  Key: 'test-cors.txt',
  ContentType: 'text/plain',
});

const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
console.log(signedUrl);
