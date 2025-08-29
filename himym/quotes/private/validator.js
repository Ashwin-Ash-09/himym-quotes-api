// import { Character } from "../../models/models.js";
const getEpisodesPerSeason = (season) => {
  const episodeMap = {
    1: 22,
    2: 22,
    3: 20,
    4: 24,
    5: 24,
    6: 24,
    7: 24,
    8: 24,
    9: 24,
  };
  return episodeMap[season] || 0;
};
const isValidCharacterId = async (id) => {
  const numericId = parseInt(id, 10);
  const count = 19;
  return !isNaN(numericId) && numericId >= 0 && numericId <= count;
};

export const validator = {
  validateQuote: (quoteText) => {
    let response = {
      success: true,
      messages: [],
    };

    if (
      !quoteText ||
      typeof quoteText !== "string" ||
      quoteText.trim() === ""
    ) {
      response.success = false;
      response.messages.push(
        "Quote text is required and must be a non-empty string."
      );
    }
    return response;
  },

  validateCharacter: (character) => {
    let response = {
      success: true,
      messages: [],
    };

    if (!character) {
      response.success = false;
      response.messages.push("Character object is missing.");
      return response;
    }
    if (
      !character.name ||
      typeof character.name !== "string" ||
      character.name.trim() === ""
    ) {
      response.success = false;
      response.messages.push(
        "Character name is required and must be a non-empty string."
      );
    }

    if (
      !character.actor ||
      typeof character.actor !== "string" ||
      character.actor.trim() === ""
    ) {
      response.success = false;
      response.messages.push(
        "Actor name is required and must be a non-empty string."
      );
    }

    return response;
  },
  validateCharacterId: (id) => {
    let response = { success: true, messages: [] };
    if (id === undefined) {
      response.success = false;
      response.messages.push("Character ID is required.");
    } else if (!isValidCharacterId(id)) {
      response.success = false;
      response.messages.push(`Invalid character id: '${id}'.`);
    }
    return response;
  },
  validateEpisode: (episode) => {
    let response = {
      success: true,
      messages: [],
    };

    if (!episode) {
      response.success = false;
      response.messages.push("Episode object is missing.");
      return response;
    }

    const season = parseInt(episode.season, 10);
    if (isNaN(season) || season < 0 || season > 9) {
      response.success = false;
      response.messages.push("Season must be a number between 0 and 9.");
    }

    if (!response.messages.some((msg) => msg.includes("Season"))) {
      const episodeNum = parseInt(episode.episode, 10);
      const maxEpisodes = getEpisodesPerSeason(season);
      if (isNaN(episodeNum) || episodeNum < 0 || episodeNum > maxEpisodes) {
        response.success = false;
        response.messages.push(
          `Episode number for season ${season} must be between 0 and ${maxEpisodes}.`
        );
      }
    }

    if (
      !episode.title ||
      typeof episode.title !== "string" ||
      episode.title.trim() === ""
    ) {
      response.success = false;
      response.messages.push(
        "Episode title is required and must be a non-empty string."
      );
    }

    const year = parseInt(episode.year, 10);
    if (isNaN(year) || year < 2004 || year > 2006) {
      response.success = false;
      response.messages.push("Year must be a number between 2004 and 2006.");
    }

    return response;
  },

  validateAll: (data) => {
    let finalResponse = {
      success: true,
      messages: [],
    };

    if (!data) {
      finalResponse.success = false;
      finalResponse.messages.push("Main data object is missing.");
      return finalResponse;
    }

    const quoteValidation = validator.validateQuote(data.quote);
    if (!quoteValidation.success) {
      finalResponse.success = false;
      finalResponse.messages.push(...quoteValidation.messages);
    }

    const characterValidation = validator.validateCharacterId(
      data.character
    );
    if (!characterValidation.success) {
      finalResponse.success = false;
      finalResponse.messages.push(...characterValidation.messages);
    }

    const episodeObj = data.episode
      ? { ...data.episode, year: 2005 }
      : undefined;

    const episodeValidation = validator.validateEpisode(episodeObj);
    if (!episodeValidation.success) {
      finalResponse.success = false;
      finalResponse.messages.push(...episodeValidation.messages);
    }

    return finalResponse;
  },
};
