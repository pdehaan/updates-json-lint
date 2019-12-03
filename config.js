const convict = require("convict");

const cfg = convict({
  addonId: {
    doc: "Add-on ID for the updates.json file.",
    format: String,
    default: undefined,
    env: "ADDON_ID",
    arg: "addonId"
  },
  updatesJsonUri: {
    doc: "Full URI to the updates.json file.",
    format: 'url',
    default: undefined,
    env: "UPDATES_JSON_URI",
    arg: "updatesJsonUri"
  },
  hostname: {
    doc: "Allowed hostname for the XPI update links in the updates.json file.",
    format: String,
    default: undefined,
    env: "HOSTNAME",
    arg: "hostname"
  }
});

cfg.validate({ allowed: "strict" });

module.exports = cfg;
