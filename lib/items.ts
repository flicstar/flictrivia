import { Item, PlayedItem } from "../types/item";
import { createWikimediaImage } from "./image";

export function getRandomItem(deck: Item[], played: Item[]): Item {
  const useFamily = Math.random() < 0.25;

  const familyCandidates = deck.filter(c => c.category === "family");
  const triviaCandidates = deck.filter(c => c.category !== "family");

  const source =
    useFamily && familyCandidates.length > 0 ? familyCandidates : triviaCandidates;

  const periods: [number, number][] = [
    [1770, 1849],
    [1850, 1900],
    [1901, 1945],
    [1946, 1975],
    [1976, 2000],
    [2001, 2024],
  ];

  const [fromYear, toYear] = periods[Math.floor(Math.random() * periods.length)];

  // First pass: within the chosen period
  const filtered = source.filter(candidate => {
    if (candidate.year < fromYear || candidate.year > toYear) return false;
    if (played.some(p => p.year === candidate.year)) return false; // one card per year
    if (tooClose(candidate, played)) return false;
    return true;
  });

  if (filtered.length > 0) {
    return filtered[Math.floor(Math.random() * filtered.length)];
  }

  // Fallback: ignore periods, still enforce one-per-year + closeness
  const relaxed = source.filter(candidate => {
    if (played.some(p => p.year === candidate.year)) return false;
    if (tooClose(candidate, played)) return false;
    return true;
  });

  if (relaxed.length > 0) {
    return relaxed[Math.floor(Math.random() * relaxed.length)];
  }

  // Last resort: only enforce one-per-year
  const noSameYear = deck.filter(candidate =>
    !played.some(p => p.year === candidate.year)
  );

  if (noSameYear.length > 0) {
    return noSameYear[Math.floor(Math.random() * noSameYear.length)];
  }

  // Absolute last resort: give anything
  return deck[Math.floor(Math.random() * deck.length)];
}  

function tooClose(item: Item, played: Item[]) {
  if (played.length === 0) return false;

  // Start wider to make early placement easier, then tighten.
  // You can tune these numbers based on playtesting.
  const distance =
    played.length < 4 ? 25 :
    played.length < 10 ? 12 :
    played.length < 25 ? 6 :
    3;

  return played.some(p => Math.abs(item.year - p.year) < distance);
}

export function checkCorrect(
  played: PlayedItem[],
  item: Item,
  index: number
): { correct: boolean; delta: number } {
  const sorted = [...played, item].sort((a, b) => a.year - b.year);
  const correctIndex = sorted.findIndex((i) => {
    return i.id === item.id;
  });

  if (index !== correctIndex) {
    return { correct: false, delta: correctIndex - index };
  }

  return { correct: true, delta: 0 };
}

export function preloadImage(url: string): HTMLImageElement {
  const img = new Image();
  img.src = createWikimediaImage(url);
  return img;
}
