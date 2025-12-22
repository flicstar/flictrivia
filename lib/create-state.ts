import { GameState } from "../types/game";
import { Item } from "../types/item";
import { getRandomItem, preloadImage } from "./items";

const STARTER_CATEGORY = "family";

function getStarterItem(deck: Item[]): Item {
  return pickRandom(deck.filter(item => item.category === STARTER_CATEGORY));
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