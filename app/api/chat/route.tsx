import { exampleAgent } from '../../agents/example/index';

export const runtime = 'edge';

export async function POST(request: Request): Promise<Response> {
  try {
    const { ctx } = await request.json();

    const stream = await exampleAgent.completionStream({
      prompt: ctx?.prompt,
      messages: ctx?.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response('bot stream failed.');
  }
}
