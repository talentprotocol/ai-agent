import { callLLM } from "../lib/ai";
import { fetchTalent } from "../lib/talent-protocol";

/**
 * ElysiaJS handler for generating goals.
 * @param {any} input function input.
 * @returns {Promise<Response>} returns a JSON containing the list of generated goals.
 */
export const goalGeneratorHandler = async ({
  body,
}: {
  body: {
    history: string[];
    talentId?: string;
    bio?: string;
    interests?: string[];
    experience?: string[];
  };
}): Promise<Response> => {
  try {
    const { talentId } = body;
    let bio: string, interests: string[], experience: string[];

    if (talentId) {
      const talent = await fetchTalent(talentId);

      if (!talent) {
        return new Response(
          JSON.stringify({ error: `Talent with id ${talentId} not found` }),
          {
            status: 404,
          }
        );
      }
      bio = talent.bio;
      interests = talent.interests;
      experience = talent.experience;
    } else if (body.bio && body.interests && body.experience) {
      // use the body data
      bio = body.bio;
      interests = body.interests;
      experience = body.experience;
    } else {
      return new Response(
        JSON.stringify({ error: `Invalid request, check the input body.` }),
        { status: 400 }
      );
    }
    // user prompt.
    const prompt = `
  Bio: ${bio}
  Experience: ${experience.join(", ")}
  Interests: ${interests.join(", ")}
  `;
    // initialize the OpenAI chat model
    const response = await callLLM(prompt, body.history, true);
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
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "internal server error." }), {
      status: 500,
    });
  }
};

/**
 * ElysiaJS handler for generating descriptions.
 * @param {any} input function input.
 * @returns {Promise<Response>} returns a JSON containing the list of generated goals descriptions.
 */
export const goalDescriptionGeneratorHandler = async ({
  body,
}: {
  body: {
    goal: string;
    talentId?: string;
    bio?: string;
    interests?: string[];
    experience?: string[];
  };
}) => {
  try {
    const { talentId, goal } = body;
    let bio: string, interests: string[], experience: string[];

    if (talentId) {
      const talent = await fetchTalent(talentId);

      if (!talent) {
        return new Response(
          JSON.stringify({ error: `Talent with id ${talentId} not found` }),
          {
            status: 404,
          }
        );
      }
      bio = talent.bio;
      interests = talent.interests;
      experience = talent.experience;
    } else if (body.bio && body.interests && body.experience) {
      // use the body data
      bio = body.bio;
      interests = body.interests;
      experience = body.experience;
    } else {
      return new Response(
        JSON.stringify({ error: `Invalid request, check the input body.` }),
        { status: 400 }
      );
    }
    // user prompt.
    const prompt = `
    Goal: ${goal}
    Bio: ${bio}
    Experience: ${experience.join(", ")}
    Interests: ${interests.join(", ")}
    `;
    // initialize the OpenAI chat model
    const response = await callLLM(prompt, [], false);
    // parse the response
    try {
      const jsonResponse = JSON.parse(response);
      return new Response(
        JSON.stringify({ response: jsonResponse.descriptions }),
        {
          status: 200,
        }
      );
    } catch (error) {
      // the output returned by the model is not a valid JSON
      // something went wrong somewhere
      console.error(error);
      return new Response(JSON.stringify({ error: response }), {
        status: 500,
      });
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "internal server error." }), {
      status: 500,
    });
  }
};
