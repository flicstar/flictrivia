import { Item, PlayedItem } from "../types/item";
import { createWikimediaImage } from "./image";

export function getRandomItem(deck: Item[], played: Item[]): Item {
  // If you still want category weighting, keep it:
  const useFamily = Math.random() < 0.25;


  const familyCandidates = deck.filter(c => c.category === "family");
  const triviaCandidates = deck.filter(c => c.category !== "family");

  // choose which pool we select from
  const source = useFamily && familyCandidates.length > 0
    ? familyCandidates
    : triviaCandidates;
    
  const periods: [number, number][] = [
    [1770, 1849],
    [1850, 1900],
    [1901, 1945],
    [1946, 1975],
    [1976, 2000],
    [2001, 2024],
  ];
 const [fromYear, toYear] = periods[Math.floor(Math.random() * periods.length)];

  const filtered = source.filter(candidate => {
    if (candidate.year < fromYear || candidate.year > toYear) return false;

    // Prevent same-year duplicates
    if (played.some(p => p.year === candidate.year)) return false;

    // Keep or tweak closeness
    if (tooClose(candidate, played)) return false;

    return true;
  });

  if (filtered.length > 0) {
    return filtered[Math.floor(Math.random() * filtered.length)];
  }

  // Fallback: try again without the period restriction, but still prevent duplicates/closeness
  const candidates = source.filter(candidate => {
  // Rule #1: one card per year
  if (played.some(p => p.year === candidate.year)) return false;

  if (candidate.year < fromYear || candidate.year > toYear) return false;
  if (tooClose(candidate, played)) return false;

  return true;
});

  if (relaxed.length > 0) {
    return relaxed[Math.floor(Math.random() * relaxed.length)];
  }

  // Absolute last resort: just avoid same-year duplicates at least
  const noSameYear = deck.filter(candidate => !played.some(p => p.year === candidate.year));
  if (noSameYear.length > 0) {
    return noSameYear[Math.floor(Math.random() * noSameYear.length)];
  }

  // If deck is tiny / all years already used, give up gracefully
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
