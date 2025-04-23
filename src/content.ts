import UrlHelper from "./core/class/UrlHelper";
import { getFirstPathSegment } from "./utils/path.utils";
import { observedUsers } from "./helpers/Constants";
import { clickFollowers } from "./utils/user.utils";

const onPageRefresh = (path: string) => {
  const firstSegment = getFirstPathSegment(path);

  if (!observedUsers.includes(firstSegment)) {
    return;
  }

  clickFollowers(firstSegment);
};

const onPathChange = (path: string) => {
  console.log("ChangedPath: ", path);
};

const startApp = () => {
  const urlHelper = new UrlHelper("www.instagram.com", (path) =>
    onPathChange(path)
  );

  onPageRefresh(urlHelper.path);
};

startApp();
