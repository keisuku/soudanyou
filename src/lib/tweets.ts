const trustedPoster = "winenomuhito";

export function sortTweetUrls(urls: string[]): string[] {
  return [...urls].sort((a, b) => {
    const aPinned = a.toLowerCase().includes(trustedPoster) ? 0 : 1;
    const bPinned = b.toLowerCase().includes(trustedPoster) ? 0 : 1;
    return aPinned - bPinned;
  });
}

export function pickPrimaryTweetUrl(urls: string[]): string | undefined {
  return sortTweetUrls(urls)[0];
}
