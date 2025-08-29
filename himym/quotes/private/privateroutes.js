import express, { response } from "express";
import { validator } from "./validator.js";
import { Quote, Character } from "../../models/models.js";
import { authenticateApiKey } from "./authMiddleware.js";

const privaterouter = express.Router();


privaterouter.post("/quotes", authenticateApiKey, async (req, res) => {
  let body = req.body;

  // Validate the request body
  const valid = validator.validateAll(body);
  if (!valid.success) {
    return res.status(400).send(valid);
  }

  // Auto-increment quote ID
  body.id = (await Quote.countDocuments({})) + 1;

  try {
    // Find the Character by your numeric id
    const character = await Character.findOne({ id: body.character });
    if (!character) {
      return res.status(400).json({ error: "Character not found" });
    }

    // Replace numeric character ID with MongoDB ObjectId
    body.character = character._id;

    // Save the Quote
    const quote = new Quote(body);
    const savedQuote = await quote.save();

    res.json((await savedQuote.populate("character")).toObject());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


privaterouter.post("/characters", authenticateApiKey, async (req, res) => {
  const body = req.body;

  // Validate input
  const valid = validator.validateCharacter(body);
  if (!valid.success) {
    return res.status(400).send(valid);
  }

  try {
    // Count existing documents and assign next id
    const total = (await Character.countDocuments({}));
    body.id = total + 1;

    const character = new Character(body);
    const savedCharacter = await character.save();

    res.json(savedCharacter.toObject());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default privaterouter;
