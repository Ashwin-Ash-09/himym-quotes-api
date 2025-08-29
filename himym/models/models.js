import mongoose from "mongoose";

const EpisodeSchema = new mongoose.Schema({
  season: {
    type: Number,
    required: true,
  },
  episode: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});

const CharacterSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  actor: {
    type: String,
    required: true,
    unique: true,
  },
});
const QuoteSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  quote: {
    type: String,
    required: true,
  },
  character: {

      type: mongoose.Schema.Types.ObjectId,
      ref: "Character",
      required: true,
    
  },
  episode: {
    type: EpisodeSchema,
    required: true,
  },
});

const Quote = mongoose.model("Quote", QuoteSchema);
const Character = mongoose.model("Character", CharacterSchema);

export { Quote, Character };
