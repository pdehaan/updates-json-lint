const Joi = require("@hapi/joi");
const got = require("got");

validateUpdatesJson(
  "https://fpn.firefox.com/downloads/browser/updates.json",
  "secure-proxy@mozilla.com",
  "^https://fpn.firefox.com/downloads/browser/(v(\\d)*?|latest)/secure-proxy.xpi$"
)
  .then(() => {
    console.log("success");
  })
  .catch(err => {
    console.error(err.message);
    for (const msg of err.messages) {
      console.error(`- ${msg}`);
    }
    process.exit(1);
  });

async function validateUpdatesJson(updatesJsonUri, addonId, xpiRegExp) {
  const data = await got.get(updatesJsonUri, { requestBodyOnly: true }).json();
  const schema = createSchema(addonId, new RegExp(xpiRegExp));
  const res = schema.validate(data, {
    abortEarly: false,
    presence: "required"
  });

  if (res.error) {
    const err = new Error(`${updatesJsonPath} data is invalid`);
    err.messages = res.error.details.map(err => err.message);
    throw err;
  }

  return res.value;
}

function createSchema(addonId, xpiRegExp) {
  const { array, object, string } = Joi.types();
  const versionSchema = string.pattern(/^[\d.]*$/);

  return object.keys({
    addons: {
      [addonId]: {
        updates: array.items({
          version: versionSchema.example("0.9").example("15"),
          update_link: string.uri({ scheme: ["https"] }).regex(xpiRegExp),
          applications: {
            gecko: {
              strict_min_version: versionSchema.example("68.0.1")
            }
          }
        })
      }
    }
  });
}
