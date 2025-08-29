import { Quote, Character } from "../../models/models.js";


export const generateRandomNumber = (min = 1, max = 100) => {
  const now = new Date();
  const seed = now.getTime() % 10000;
  const range = max - min + 1;
  return min + (seed % range);
};


export const getRandomQuote = async () => {
  const count = await Quote.countDocuments();
  const randomIndex = generateRandomNumber(0, count - 1);
  return await Quote.findOne().skip(randomIndex).populate('character');
};


export const getRandomSeasonQuote = async (season) => {
  const count = await Quote.countDocuments({ 'episode.season': season });
  const randomIndex = generateRandomNumber(0, count - 1);
  return await Quote.findOne({ 'episode.season': season }).skip(randomIndex).populate('character');
};


export const getRandomCharacterQuote = async (characterId) => {
  const count = await Quote.countDocuments({ character: characterId });
  const randomIndex = generateRandomNumber(0, count - 1);
  return await Quote.findOne({ character: characterId }).skip(randomIndex).populate('character');
};


export const createPagination = (page, limit, total, baseUrl, filters = {}) => {
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;
  
  const filterParams = Object.keys(filters)
    .map(key => `${key}=${filters[key]}`)
    .join('&');
  
  const separator = filterParams ? '&' : '';
  
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext,
    hasPrev,
    next: hasNext ? `${baseUrl}?page=${page + 1}&limit=${limit}${separator}${filterParams}` : null,
    prev: hasPrev ? `${baseUrl}?page=${page - 1}&limit=${limit}${separator}${filterParams}` : null
  };
};


export const applyPagination = (query, page, limit) => {
  const skip = (page - 1) * limit;
  return query.skip(skip).limit(limit);
};
