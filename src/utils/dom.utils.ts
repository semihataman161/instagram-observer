export const waitForElement = async (selector: string, timeoutMs?: number) => {
  const existing = document.querySelector(selector) as HTMLElement | null;

  if (existing) return existing;

  return new Promise<HTMLElement | null>((resolve) => {
    const observer = new MutationObserver(() => {
      const found = document.querySelector(selector) as HTMLElement | null;
      if (found) {
        observer.disconnect();
        resolve(found);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    if (timeoutMs) {
      setTimeout(() => {
        observer.disconnect();
        resolve(null);
      }, timeoutMs);
    }
  });
};
