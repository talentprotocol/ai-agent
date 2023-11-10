import { ChatOpenAI } from "langchain/chat_models/openai";
import { SystemMessage, HumanMessage, AIMessage } from "langchain/schema";
import { goalGeneratorSystemTemplate } from "../constants";
import { env } from "../env";

/**
 * Function that calls OpenAI chat model with the given prompt and history.
 * @param {string} prompt user input prompt.
 * @param {string[][]} history array of arrays of past goals.
 * @returns {string} returns the response from the OpenAI chat model.
 */
export const callLLM = async (
  prompt: string,
  history: string[][]
): Promise<string> => {
  const llm = new ChatOpenAI({
    modelName: "gpt-3.5-turbo-1106",
    temperature: 0,
    openAIApiKey: env.OPENAI_API_KEY,
  });
  // initialize the messages to send to the model
  const systemMessage = new SystemMessage({
    content: goalGeneratorSystemTemplate,
  });
  const userMessage = new HumanMessage({
    content: prompt,
  });
  const messages = [systemMessage, userMessage];
  // check if there is a history of past messages
  if (history.length > 0) {
    // if there is, add the history to the messages to send to the model
    for (let i = 0; i < history.length; i++) {
      messages.push(
        new AIMessage({
          content: JSON.stringify({ goals: history[i] }),
        })
      );
      // new human message, it enforces new 3 different goals with the same JSON format as the previous ones
      messages.push(
        new HumanMessage({
          content:
            'Can you generate 3 more goals for me different from the previous ones? Respond in JSON format with a JSON object with a key "goals" containing a list of all the goals as string.',
        })
      );
    }
  }
  // call the llm
  const response = await llm.call(messages);

  return response.content.toString();
};
