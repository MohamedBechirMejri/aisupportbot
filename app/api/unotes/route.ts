import { NextApiResponse } from "next";
import { NextResponse } from "next/server";
import OpenAI from "openai";

// Optional, but recommended: run on the edge runtime.
// See https://vercel.com/docs/concepts/functions/edge-functions
export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request, res: NextApiResponse) {
  // Extract the `messages` from the body of the request
  const { info } = await req.json();

  const messages: any = [
    ...systemMessages,
    {
      role: "user",
      content: info,
    },
  ];

  // Request the OpenAI API for the response based on the prompt
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
  });

  return NextResponse.json({
    data: JSON.parse(response.choices[0].message.content!),
  });
}

const systemMessages = [
  {
    role: "system",
    content: "You are a very smart bot",
  },
  {
    role: "system",
    content:
      "you receive a some text and you will analyze it and return specific data according to context",
  },
  {
    role: "system",
    content: `the data should be in the form { Course Code, Course Name, Year, Season, Document Type}`,
  },
  {
    role: "system",
    content: `the  Document Type should be one of these MIDTERM_EXAM, FINAL_EXAM,LABS,QUIZZES,EXERCISES,NOTES or null if you can't find it`,
  },
  {
    role: "system",
    content: `the season should be one of these SUMMER,AUTUMN,WINTER,SPRING or null if you can't find it`,
  },
  {
    role: "system",
    content:
      "return the data in an object and if you can't find the data return null for that field",
  },
];
