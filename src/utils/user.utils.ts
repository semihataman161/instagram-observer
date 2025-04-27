import { waitForElement } from "./dom.utils";

export const clickFollowers = async (userName: string) => {
  const selector = `a[href="/${userName}/followers/"]`;
  const element = await waitForElement(selector, 5000);

  if (!element) {
    console.error("clickFollowers: Element not found");
    return;
  }

  element.click();
};

export const clickFollowing = async (userName: string) => {
  const selector = `a[href="/${userName}/following/"]`;
  const element = await waitForElement(selector, 5000);

  if (!element) {
    console.error("clickFollowing: Element not found");
    return;
  }

  element.click();
};
