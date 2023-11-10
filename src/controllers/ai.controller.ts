import { db } from "../db";
import { callLLM } from "../lib/ai";

/**
 * ElysiaJS handler for generating goals.
 * @param {{ params: { talentId: string }; body: { history: string[][] }; }} input function input.
 * @returns {Promise<Response>} returns a JSON containing the list of generated goals.
 */
export const goalGeneratorHandler = async ({
  params: { talentId },
  body,
}: {
  params: { talentId: string };
  body: { history: string[][] };
}): Promise<Response> => {
  // retrieve the talent from the mock db
  // TODO: change it to the Talent Protocol API request
  const talent = db.find((t) => t.id === talentId);
  // return 404 if no talent is found with that ID
  if (!talent) {
    return new Response(
      JSON.stringify({ error: `Talent with id ${talentId} not found` }),
      {
        status: 404,
      }
    );
  }
  // extract bio, interests and experience
  const { bio, interests, experience } = talent;
  // user prompt.
  const prompt = `
  Bio: ${bio}
  Experience: ${experience.join(", ")}
  Interests: ${interests.join(", ")}
  `;
  // initialize the OpenAI chat model
  const response = await callLLM(prompt, body.history);
  // parse the response
  try {
    const jsonResponse = JSON.parse(response);
    return new Response(JSON.stringify({ response: jsonResponse.goals }), {
      status: 200,
    });
  } catch (error) {
    // the output returned by the model is not a valid JSON
    // something went wrong somewhere
    console.error(error);
    return new Response(JSON.stringify({ error: response }), {
      status: 500,
    });
  }
};

// export const goalDescriptionGeneratorHandler = async ({
//   params: { talentId },
// }: {
//   params: { talentId: string };
// }) => {
//   const talent = db.find((t) => t.id === talentId);
//   if (!talent) {
//     return new Response(
//       JSON.stringify({ error: `Talent with id ${talentId} not found` }),
//       {
//         status: 404,
//       }
//     );
//   }
// };
