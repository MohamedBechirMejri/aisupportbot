// ./app/api/chat/route.ts
import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

import { functions, runFunction } from "./functions";

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(config);

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  // check if the conversation requires a function call to be made
  const initialResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-0613",
    messages: messages.map((message: any) => ({
      content: message.content,
      role: message.role,
    })),
    functions,
    function_call: "auto",
    // function_call: { name: "search_knowledge_base" },
  });
  const initialResponseJson = await initialResponse.json();
  const initialResponseMessage = initialResponseJson?.choices?.[0]?.message;

  if (!initialResponseMessage.function_call) {
    // if there's no function call, just return the initial response
    // but first, we gotta convert initialResponse into a stream with ReadableStream
    const chunks = initialResponseMessage.content.split(" ");
    const stream = new ReadableStream({
      async start(controller) {
        for (const chunk of chunks) {
          const bytes = new TextEncoder().encode(chunk + " ");
          controller.enqueue(bytes);
          await new Promise(r =>
            setTimeout(
              r,
              // get a random number between 10ms and 30ms to simulate a random delay
              Math.floor(Math.random() * 20 + 10)
            )
          );
        }
        controller.close();
      },
    });
    return new StreamingTextResponse(stream);
  }

  let finalResponse;

  const { name, arguments: args } = initialResponseMessage.function_call;
  const functionResponse = await runFunction(name, JSON.parse(args));

  finalResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-0613",
    stream: true,
    messages: [
      ...messages,
      initialResponseMessage,
      {
        role: "function",
        name: initialResponseMessage.function_call.name,
        content: JSON.stringify(functionResponse),
      },
    ],
  });
  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(finalResponse);
  return new StreamingTextResponse(stream);
}
