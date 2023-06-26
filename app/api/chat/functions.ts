type FunctionNames = "search_knowledge_base";

export const functions: {
  name: FunctionNames;
  description: string;
  parameters: object;
}[] = [
  {
    name: "search_knowledge_base",
    description: "Search the knowledge base for an answer to a question.",
    parameters: {
      type: "object",
      properties: {
        question: {
          type: "string",
          description: "search query to find an answer to the question",
        },
      },
      required: ["question"],
    },
  },
];

async function search_knowledge_base(question: string) {
  console.log("searching knowledge base for", question);

  const api =
    "https://testcompany-j.helpjuice.com/api/v3/search?api_key=85a593f3b7c3844f847b86e60155433a&query=";

  const response = await fetch(api + question);
  const json = await response.json();

  const answers = json.searches.map((search: any) => ({
    question: search.name,
    answer: search.long_answer_sample,
    url: search.url,
  }));

  console.log("answers", answers);

  return answers;
}

export async function runFunction(name: string, args: any) {
  switch (name) {
    case "search_knowledge_base":
      return await search_knowledge_base(args["question"]);
    default:
      return null;
  }
}
