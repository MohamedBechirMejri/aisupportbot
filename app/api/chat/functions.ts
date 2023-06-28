type FunctionNames = "search_knowledge_base";

export const functions: {
  name: FunctionNames;
  description: string;
  parameters: object;
}[] = [
  {
    name: "search_knowledge_base",
    description:
      "Search the knowledge base for an answer to a question using keywords from the question as the query",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "search query to find an answer to the question",
        },
      },
      required: ["query"],
    },
  },
];

async function search_knowledge_base(query: string) {
  console.log("searching for: ", query); // TODO: connect this with websocket to send to client

  const url = "https://testcompany-j.helpjuice.com";
  const api_key = "85a593f3b7c3844f847b86e60155433a";
  const searchApi = `${url}/api/v3/search?api_key=${api_key}&query=${query}`;

  const articleApi = (id: string) =>
    `${url}/api/v3/articles/${id}?api_key=${api_key}`;

  const response = await fetch(searchApi);
  const json = await response.json();

  const answers = await Promise.all(
    json.searches
      .filter((_: any, i: number) => i < 3)
      .map(async (search: any) => {
        const response = await fetch(articleApi(search.id));
        const data = await response.json();
        return { ...data };
      })
  ).then(results =>
    results.map(data => ({
      name: data.article.name,
      body: data.article.answer.body_txt,
      url: data.article.url,
    }))
  );

  return answers;
}

export async function runFunction(name: string, args: any) {
  switch (name) {
    case "search_knowledge_base":
      return await search_knowledge_base(args["query"]);
    default:
      return null;
  }
}
