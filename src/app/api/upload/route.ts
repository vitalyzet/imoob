import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { filename, contentType } = await req.json();

    if (!filename || !contentType) {
      return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 });
    }

    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const bucketName = process.env.R2_BUCKET_NAME;
    const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

    if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
      console.error('Missing Cloudflare R2 credentials in environment variables.');
      return NextResponse.json({ error: 'Configuración del servidor incompleta' }, { status: 500 });
    }

    const s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    // Generate a unique filename to prevent overwriting
    const uniqueFileName = `${crypto.randomUUID()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: uniqueFileName,
      ContentType: contentType,
    });

    // The presigned URL expires in 300 seconds (5 minutes)
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

    const finalUrl = publicUrl 
        ? `${publicUrl}/${uniqueFileName}`
        : `https://${bucketName}.${accountId}.r2.cloudflarestorage.com/${uniqueFileName}`;

    return NextResponse.json({
      uploadUrl: signedUrl,
      finalUrl: finalUrl,
    });

  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    return NextResponse.json({ error: 'Error del servidor al generar URL de subida' }, { status: 500 });
  }
}
