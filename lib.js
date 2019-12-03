const got = require("got");
const _Joi = require("@hapi/joi");

const domainLint = require("./joi-domain-lint");
const Joi = _Joi.extend(domainLint);

module.exports = {
  createSchema,
  getUpdatesJson,
  linkCheck,
  validateUpdatesJson
};

function createSchema(addonId) {
  const { array, object, string, domain } = Joi.types();
  const versionSchema = string.pattern(/^[\d.]*$/);

  return object.keys({
    addons: {
      [addonId]: {
        updates: array.items({
          version: versionSchema.example("0.9").example("15"),
          update_link: domain,
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

async function getUpdatesJson(uri) {
  return await got.get(uri, { requestBodyOnly: true }).json();
}

async function linkCheck(uri, fn = statusOK) {
  return got
    .head(uri)
    .then(fn)
    .catch(err => {
      err.uri = uri;
      throw err;
    });
}

function statusOK(res) {
  res.stat;
  return res.statusMessage === "OK";
}

async function validateUpdatesJson(addonId, updatesJsonUri) {
  const schema = createSchema(addonId);
  const data = await getUpdatesJson(updatesJsonUri);

  return schema.validateAsync(data, {
    abortEarly: false,
    presence: "required"
  });
}
