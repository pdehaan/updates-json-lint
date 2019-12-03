#!/usr/bin/env node

const config = require("./config");
const lib = require("./lib");

lib
  .validateUpdatesJson(
    config.get("addonId"),
    config.get("updatesJsonUri")
  )
  .then(() => console.log("success"))
  .catch(err => {
    console.error(err.message);
    if (err.messages) {
      for (const msg of err.messages) {
        console.error(`- ${msg}`);
      }
    }
    process.exit(1);
  });
