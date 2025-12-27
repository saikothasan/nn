import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

interface SummaryRequestBody {
  content: string;
}

interface AiResponse {
  response?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { content } = (await req.json()) as SummaryRequestBody;

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const { env } = getCloudflareContext();

    const systemPrompt = `You are a professional editor. 
    Summarize the following blog post content into 2-3 concise, engaging sentences. 
    Capture the main value proposition or key takeaways.`;

    // Truncate content to avoid token limits if necessary (approx 3000 chars is usually safe for quick summaries)
    const truncatedContent = content.slice(0, 4000);

    const aiResponse = await env.AI.run(
      "@cf/meta/llama-3.1-8b-instruct",
      {
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: truncatedContent }
        ]
      },
      {
        gateway: {
          id: "vibesdk-gateway",
          skipCache: false
        }
      }
    ) as unknown as AiResponse;

    const summary = aiResponse?.response || "Could not generate summary.";

    return NextResponse.json({
      success: true,
      data: summary
    });

  } catch (error: unknown) {
    console.error('Summary Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Summary failed', details: errorMessage }, { status: 500 });
  }
}
