import { t } from "elysia";

export const goalGeneratorAPIDetails = {
  type: "json",
  params: t.Object({
    talentId: t.String({
      description:
        "The Talent Protocol ID of the user you want to generate goals for.",
    }),
  }),
  body: t.Object({
    history: t.Array(t.Array(t.String())),
  }),
  detail: {
    summary: "Generate a list goals for a talent based on their profile info",
    description:
      "Given a talent ID, generate a list of goals based on their profile info (bio, experience and interests).",
    tags: ["AI"],
    responses: {
      200: {
        description: "Returns a JSON containing the list of generated goals.",
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
