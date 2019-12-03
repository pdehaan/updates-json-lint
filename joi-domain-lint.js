const config = require("./config");
const lib = require("./lib");

module.exports = domainLint;

function domainLint(joi) {
  const type = "domain";
  return {
    type,
    base: joi.string().required(),
    messages: {
      [`${type}.wrongProtocol`]: "'{{#label}}' must use https: protocol",
      [`${type}.wrongDomain`]: "'{{#label}}' must be a valid domain",
      [`${type}.wrongExtension`]: "'{{#label}}' must be an XPI file",
      [`${type}.badLink`]: "'{{#label}}' is an invalid link"
    },
    validate(value, helpers) {
      const url = new URL(value);
      if (url.protocol !== "https:") {
        return {
          value,
          errors: helpers.error(`${type}.wrongProtocol`)
        };
      }

      let hostname = config.get("hostname");
      if (!hostname) {
        hostname = new URL(config.get("updatesJsonUri")).hostname;
      }
      if (url.hostname !== hostname) {
        return {
          value,
          errors: helpers.error(`${type}.wrongDomain`)
        };
      }

      if (!url.pathname.endsWith(".xpi")) {
        return {
          value,
          errors: helpers.error(`${type}.wrongExtension`)
        };
      }

      // try {
      //   await lib.linkCheck(url.href);
      // } catch (err) {
      //   return {
      //     value,
      //     errors: helpers.error(`${type}.badLink`)
      //   };
      // }

      return { value };
    }
  };
}
