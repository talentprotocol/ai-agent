import { t } from "elysia";

export const goalGeneratorAPIDetails = {
  type: "json",
  body: t.Object({
    history: t.Array(t.String()),
    talentId: t.Optional(
      t.String({
        description:
          "The Talent Protocol ID of the user you want to generate goals for.",
      })
    ),
    bio: t.Optional(
      t.String({
        description: "The bio of the user you want to generate goals for.",
      })
    ),
    interests: t.Optional(
      t.Array(t.String(), {
        description:
          "The interests of the user you want to generate goals for.",
      })
    ),
    experience: t.Optional(
      t.Array(t.String(), {
        description:
          "The experience of the user you want to generate goals for.",
      })
    ),
  }),
  detail: {
    summary: "Generate a list goals for a talent based on their profile info",
    description:
      "Given a talent ID, generate a list of goals based on their profile info (bio, experience and interests). You can also pass directly the bio, interests and experience of the user, without passing the Talent ID.",
    tags: ["AI"],
    responses: {
      200: {
        description: "Returns a JSON containing the list of generated goals.",
      },
      400: {
        description: "Bad request, check the input body.",
      },
      404: {
        description: "No talent found with the provided talent ID.",
      },
      429: {
        description: "Too many requests.",
      },
      500: {
        description: "Something went wrong on our side.",
      },
    },
  },
};

export const goalDescriptionGeneratorAPIDetails = {
  type: "json",
  body: t.Object({
    // history: t.Array(t.Array(t.String())),
    goal: t.String({
      description: "Goal to generate a description for.",
    }),
    talentId: t.Optional(
      t.String({
        description:
          "The Talent Protocol ID of the user you want to generate goals for.",
      })
    ),
    bio: t.Optional(
      t.String({
        description: "The bio of the user you want to generate goals for.",
      })
    ),
    interests: t.Optional(
      t.Array(t.String(), {
        description:
          "The interests of the user you want to generate goals for.",
      })
    ),
    experience: t.Optional(
      t.Array(t.String(), {
        description:
          "The experience of the user you want to generate goals for.",
      })
    ),
  }),
  detail: {
    summary:
      "Generate a description of a goal for a talent based on their profile info",
    description:
      "Given a talent ID and a goal, generate a list of goals descriptions based on their profile info (bio, experience and interests). You can also pass directly the bio, interests and experience of the user, without passing the Talent ID.",
    tags: ["AI"],
    responses: {
      200: {
        description:
          "Returns a JSON containing the list of generated goals descriptions.",
      },
      400: {
        description: "Bad request, check the input body.",
      },
      404: {
        description: "No talent found with the provided talent ID.",
      },
      429: {
        description: "Too many requests.",
      },
      500: {
        description: "Something went wrong on our side.",
      },
    },
  },
};
