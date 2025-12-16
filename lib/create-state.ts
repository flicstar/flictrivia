import { GameState } from "../types/game";
import { Item } from "../types/item";
import { getRandomItem, preloadImage } from "./items";

const STARTER_PERIOD: [number, number] = [1901, 1945]; // <-- change this

function getStarterItem(deck: Item[]): Item {
  const [fromYear, toYear] = STARTER_PERIOD;

  const pool = deck.filter((item) => item.year >= fromYear && item.year <= toYear);
  const source = pool.length > 0 ? pool : deck;

  return source[Math.floor(Math.random() * source.length)];
}

export default async function createState(deck: Item[]): Promise<GameState> {
  const starter = getStarterItem(deck);

  const played = [{ ...starter, played: { correct: true } }];
  const next = getRandomItem(deck, played);
  const nextButOne = getRandomItem(deck, [...played, next]);
  const imageCache = [preloadImage(next.image), preloadImage(nextButOne.image)];

  return {
    badlyPlaced: null,
    deck,
    imageCache,
    lives: 3,
    next,
    nextButOne,
    played,
  };
}