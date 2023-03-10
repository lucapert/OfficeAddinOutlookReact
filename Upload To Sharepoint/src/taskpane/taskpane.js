/* eslint-disable @typescript-eslint/no-unused-vars */
// import { checkUserIsSharepointUser } from "../helpers/middle-tier-calls";

// /* eslint-disable no-undef */
// Office.onReady((info) => {
//   if (info.host === Office.HostType.Outlook) {
//     document.getElementById("getProfileButton").onclick = run;
//   }
// });

// export async function run() {
//   debugger;
//   const result = await checkUserIsSharepointUser(Office?.context?.mailbox?.userProfile?.emailAddress);
// }
import App from "./components/App";
import { AppContainer } from "react-hot-loader";
import { initializeIcons } from "@fluentui/font-icons-mdl2";
import * as React from "react";
import * as ReactDOM from "react-dom";
/* global document, Office, module, require */

initializeIcons();

let isOfficeInitialized = false;

const title = "Contoso Task Pane Add-in";

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component title={title} isOfficeInitialized={isOfficeInitialized} />
    </AppContainer>,
    document.getElementById("container")
  );
};

/* Render application after Office initializes */
Office.onReady(() => {
  isOfficeInitialized = true;
  render(<App />);
});

/* Initial render showing a progress bar */
render(<App />);

if (module.hot) {
  module.hot.accept("./components/App", () => {
    const NextApp = require("./components/App").default;
    render(NextApp);
  });
}
