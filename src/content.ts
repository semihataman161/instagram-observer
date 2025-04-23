import UrlHelper from "./core/class/UrlHelper";

const onPathChange = (path: string) => {
  console.log("ChangedPath: ", path);
};

const runOnInitialLoad = (path: string) => {};

const startApp = () => {
  const urlHelper = new UrlHelper("www.instagram.com", (path) =>
    onPathChange(path)
  );

  runOnInitialLoad(urlHelper.path);
};

startApp();
