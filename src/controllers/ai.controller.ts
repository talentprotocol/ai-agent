import { env } from "../env";
import { callLLM } from "../lib/ai";

/**
 * ElysiaJS handler for generating goals.
 * @param {any} input function input.
 * @returns {Promise<Response>} returns a JSON containing the list of generated goals.
 */
export const goalGeneratorHandler = async ({
  body,
}: {
  body: {
    history: string[][];
    talentId?: string;
    bio?: string;
    interests?: string[];
    experience?: string[];
  };
}): Promise<Response> => {
  const { talentId } = body;
  let bio: string, interests: string[], experience: string[];

  if (talentId) {
    // retrieve the talent from the mock db
    const response = await fetch(
      `https://api.talentprotocol.com/api/v1/talents/${talentId}`,
      {
        method: "GET",
        headers: {
          "X-API-KEY": env.TP_API_KEY,
        },
      }
    );

    if (response.status === 404) {
      return new Response(
        JSON.stringify({ error: `Talent with id ${talentId} not found` }),
        {
          status: 404,
        }
      );
    }

    const { talent } = await response.json();
    const { about, summary, tags, experiences } = talent;
    // extract bio, interests and experience
    bio = about || summary;
    interests = tags.map((tag: { label: string }) => tag.label);
    experience = experiences.map(
      (experience: {
        title: string;
        institution: string;
        description: string;
      }) =>
        `${experience.title} - ${experience.institution} - ${experience.description}`
    );
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
};

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
  const { talentId, goal } = body;
  let bio: string, interests: string[], experience: string[];

  if (talentId) {
    // retrieve the talent from the mock db
    const response = await fetch(
      `https://api.talentprotocol.com/api/v1/talents/${talentId}`,
      {
        method: "GET",
        headers: {
          "X-API-KEY": env.TP_API_KEY,
        },
      }
    );

    if (response.status === 404) {
      return new Response(
        JSON.stringify({ error: `Talent with id ${talentId} not found` }),
        {
          status: 404,
        }
      );
    }

    const { talent } = await response.json();
    const { about, summary, tags, experiences } = talent;
    // extract bio, interests and experience
    bio = about || summary;
    interests = tags.map((tag: { label: string }) => tag.label);
    experience = experiences.map(
      (experience: {
        title: string;
        institution: string;
        description: string;
      }) =>
        `${experience.title} - ${experience.institution} - ${experience.description}`
    );
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
};
