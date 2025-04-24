import { WebAccessibleResourceScript } from "./services/Script/instances/VueScript";

const startApp = () => {
  console.log('startAppBef')
  WebAccessibleResourceScript.load();
  console.log('startAppAft');
};

startApp();
