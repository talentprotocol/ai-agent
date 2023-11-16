import { env } from "../env";

interface Talent {
  bio: string;
  experience: string[];
  interests: string[];
}

/**
 * Returns a Talent object or null if the talent is not found using the input talentId.
 * @param {string} talentId id of the talent to fetch.
 * @returns {Promise<Talent | null>} fetched Talent or null.
 */
export const fetchTalent = async (talentId: string): Promise<Talent | null> => {
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
    return null;
  }

  const { talent } = await response.json();
  const { about, summary, tags, experiences } = talent;

  const talentData: Talent = {
    bio: about || summary,
    interests: tags.map((tag: { label: string }) => tag.label),
    experience: experiences.map(
      (experience: {
        title: string;
        institution: string;
        description: string;
      }) =>
        `${experience.title} - ${experience.institution} - ${experience.description}`
    ),
  };
  return talentData;
};
