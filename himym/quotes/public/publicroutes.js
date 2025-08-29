import express from "express";
const publicrouter = express.Router();
import { Quote, Character } from "../../models/models.js";
import {
  generateRandomNumber,
  createPagination,
  applyPagination,
  getRandomQuote,
  getRandomSeasonQuote,
  getRandomCharacterQuote,
} from "./helper.js";

publicrouter.get("/quotes", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const total = await Quote.countDocuments();

    const quotesQuery = Quote.find().populate("character");
    const paginatedQuery = applyPagination(quotesQuery, page, limit);
    const quotes = await paginatedQuery.exec();

    const quotesWithoutId = quotes.map((q) => {
      const quoteObj = q.toObject();
      delete quoteObj._id;
      if (quoteObj.character) {
        delete quoteObj.character._id;
      }
      return quoteObj;
    });

    const pagination = createPagination(page, limit, total, "/himym/quotes");

    res.json({
      quotes: quotesWithoutId,
      pagination,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

publicrouter.get("/quotes/random", async (req, res) => {
  try {
    const quote = await getRandomQuote();
    if (!quote) {
      return res.status(404).json({ error: "No quotes found" });
    }
     const quoteObj = quote.toObject();
    delete quoteObj._id;
      if (quoteObj.character) {
        delete quoteObj.character._id;
      }
      if (quoteObj.episode) {
        delete quoteObj.episode._id;
      }
    res.json(quoteObj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

publicrouter.get("/quotes/:id", async (req, res) => {
  try {
    const quote = await Quote.findOne({ id: req.params.id }).populate(
      "character"
    );
    if (!quote) {
      return res.status(404).json({ error: "No quotes found" });
    }
    const quoteObj = quote.toObject();
    delete quoteObj._id;
      if (quoteObj.character) {
        delete quoteObj.character._id;
      }
      if (quoteObj.episode) {
        delete quoteObj.episode._id;
      }
    res.json(quoteObj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

publicrouter.get("/quotes/character/:id", async (req, res) => {
  try {
    const characterId = parseInt(req.params.id);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const character = await Character.findOne({ id: characterId });
    if (!character) {
      return res.status(404).json({ error: "Character not found" });
    }

    const total = await Quote.countDocuments({ character: character._id });

    const quotesQuery = Quote.find({ character: character._id }).populate(
      "character"
    );
    const paginatedQuery = applyPagination(quotesQuery, page, limit);
    const quotes = await paginatedQuery.exec();

    const quotesWithoutId = quotes.map((q) => {
      const quoteObj = q.toObject();
      delete quoteObj._id;
      if (quoteObj.character) {
        delete quoteObj.character._id;
      }
      return quoteObj;
    });

    const pagination = createPagination(
      page,
      limit,
      total,
      `/himym/quotes/character/${characterId}`,
      { character: characterId }
    );

    res.json({
      quotes: quotesWithoutId,
      pagination,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

publicrouter.get("/quotes/character/:id/random", async (req, res) => {
  try {
    const characterId = parseInt(req.params.id);
    const character = await Character.findOne({ id: characterId });
    if (!character) {
      return res.status(404).json({ error: "Character not found" });
    }
    const quote = await getRandomCharacterQuote(character._id);
    if (!quote) {
      return res
        .status(404)
        .json({ error: "No quotes found for this character" });
    }const quoteObj = quote.toObject();
    delete quoteObj._id;
      if (quoteObj.character) {
        delete quoteObj.character._id;
      }
      if (quoteObj.episode) {
        delete quoteObj.episode._id;
      }
    res.json(quoteObj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

publicrouter.get("/quotes/season/:id", async (req, res) => {
  try {
    const season = parseInt(req.params.id);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (isNaN(season) || season < 0 || season > 9) {
      return res.status(400).json({ error: "Season must be between 0 and 9" });
    }

    const total = await Quote.countDocuments({ "episode.season": season });

    const quotesQuery = Quote.find({ "episode.season": season }).populate(
      "character"
    );
    const paginatedQuery = applyPagination(quotesQuery, page, limit);
    const quotes = await paginatedQuery.exec();

    const quotesWithoutId = quotes.map((q) => {
      const quoteObj = q.toObject();
      delete quoteObj._id;
      if (quoteObj.character) {
        delete quoteObj.character._id;
      }
      return quoteObj;
    });

    const pagination = createPagination(
      page,
      limit,
      total,
      `/himym/quotes/season/${season}`,
      { season }
    );

    res.json({
      quotes: quotesWithoutId,
      pagination,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

publicrouter.get("/quotes/season/:id/random", async (req, res) => {
  try {
    const season = parseInt(req.params.id);

    if (isNaN(season) || season < 0 || season > 9) {
      return res.status(400).json({ error: "Season must be between 0 and 9" });
    }

    const quote = await getRandomSeasonQuote(season);
    if (!quote) {
      return res.status(404).json({ error: "No quotes found for this season" });
    }
    res.json(quote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

publicrouter.get("/characters", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const total = await Character.countDocuments();

    const charactersQuery = Character.find();
    const paginatedQuery = applyPagination(charactersQuery, page, limit);
    const characters = await paginatedQuery.exec();

    // Remove _id from response
    const charactersWithoutId = characters.map((c) => {
      const characterObj = c.toObject();
      delete characterObj._id;
      return characterObj;
    });

    // Create pagination metadata
    const pagination = createPagination(
      page,
      limit,
      total,
      "/himym/characters"
    );

    res.json({
      characters: charactersWithoutId,
      pagination,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Export the public router
export default publicrouter;
