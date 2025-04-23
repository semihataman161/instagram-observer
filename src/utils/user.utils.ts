export const clickFollowers = (userName: string) => {
  const element = document.querySelector(
    `a[href="/${userName}/followers/"]`
  ) as HTMLAnchorElement | null;

  if (!element) {
    console.log("Followers element not found");
    return;
  }

  element.click();
};

export const clickFollowing = (userName: string) => {
  const element = document.querySelector(
    `a[href="/${userName}/following/"]`
  ) as HTMLAnchorElement | null;

  if (!element) {
    console.log("Following element not found");
    return;
  }

  element.click();
};
