import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';


export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const format = (formData.get('format') as string) || 'webp';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const { env } = await getCloudflareContext();

    // Check if IMAGES binding exists
    // We cast to any because the generated types might define it as Fetcher by default
    const imagesBinding = (env as any).IMAGES;

    if (!imagesBinding) {
      console.error("IMAGES binding is missing. Ensure 'images' binding is configured in wrangler.jsonc");
      return NextResponse.json({ 
        error: "Image optimization service is not configured correctly." 
      }, { status: 500 });
    }

    const arrayBuffer = await file.arrayBuffer();
    
    // Create image input from buffer
    const imageInput = imagesBinding.input(arrayBuffer);
    
    // Perform transformation
    // We request the output in the specified format
    const transformOptions = {
      format: format
    };

    const output = await imageInput.transform(transformOptions).output(transformOptions);
    
    // Get the response and buffer
    const response = output.response();
    const resultBuffer = await response.arrayBuffer();
    
    // Convert to base64 for the frontend
    const base64 = Buffer.from(resultBuffer).toString('base64');
    const mimeType = response.headers.get('content-type') || `image/${format}`;
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return NextResponse.json({ 
      success: true, 
      originalSize: file.size, 
      optimizedSize: resultBuffer.byteLength,
      format: format,
      image: dataUrl
    });

  } catch (e: any) {
    console.error("Image optimization error:", e);
    const message = e instanceof Error ? e.message : 'An unknown error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
