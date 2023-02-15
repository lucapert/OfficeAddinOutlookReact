/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See full license in root of repo. -->
 *
 * This file is the main Node.js server file that defines the express middleware.
 */

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
import * as createError from "http-errors";
import * as path from "path";
import * as cookieParser from "cookie-parser";
import * as logger from "morgan";
import express from "express";
import https from "https";
import { getHttpsServerOptions } from "office-addin-dev-certs";
import { checkUserIsSharepointUser } from "./sharepoint-helper";

/* global console, process, require, __dirname */

const app = express();
const port = process.env.API_PORT || "3000";

app.set("port", port);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/* Turn off caching when developing */
if (process.env.NODE_ENV !== "production") {
  app.use(express.static(path.join(process.cwd(), "dist"), { etag: false }));

  app.use(function (req, res, next) {
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    res.header("Expires", "-1");
    res.header("Pragma", "no-cache");
    next();
  });
} else {
  // In production mode, let static files be cached.
  app.use(express.static(path.join(process.cwd(), "dist")));
}

const indexRouter = express.Router();
indexRouter.get("/", function (req, res) {
  res.render("/taskpane.html");
});

app.use("/", indexRouter);

app.get("/checkuserissharepointuser", checkUserIsSharepointUser);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

getHttpsServerOptions().then((options) => {
  https
    .createServer(options, app)
    .listen(port, () => console.log(`Server running on ${port} in ${process.env.NODE_ENV} mode`));
});
