import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import * as AWS from "aws-sdk";
import appConfig from "./aws_config";
import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";
import configureAmplify from "./amplify_config";
Amplify.configure(awsExports);

configureAmplify();

const root = ReactDOM.createRoot(document.getElementById("root"));

AWS.config.update({
  region: appConfig.region,
  apiVersion: appConfig.apiVersion,
  credentials: {
    accessKeyId: appConfig.accessKeyId,
    secretAccessKey: appConfig.secretAccessKey,
  },
});
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
