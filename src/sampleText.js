const SAMPLE_PARAGRAPHS = [
"The quick brown fox jumps over the lazy dog",
"She sold seashells by the seashore every summer morning",
"Zebras zigzag across the dusty plains at dawn",
"The old lighthouse kept watch over the rocky coast",
"Would you rather travel to Japan or Iceland next year",
"Rain drummed against the window all through the night",
"Vintage records sound warmer than digital streams",
"Pack my box with five dozen liquor jugs",
"The chef sliced onions while humming an old melody",
"Nobody expected the package to arrive so quickly",
"Bright yellow taxis crowded the intersection downtown",
"Learning a new language takes about six hundred hours",
"Jack quietly moved up front and seized the big ball of wax",
"The mountain trail winds upward for eleven miles",
"Coffee shops make excellent places to observe strangers",
"Every keyboard eventually develops one sticky key",
"Glaciers carved these valleys thousands of years ago",
"Did you remember to lock the back door last night",
"Wild horses gallop freely across the northern steppe",
]


export function getRandomParagraph() {
  return SAMPLE_PARAGRAPHS[Math.floor(Math.random() * SAMPLE_PARAGRAPHS.length)].toLocaleLowerCase()
}