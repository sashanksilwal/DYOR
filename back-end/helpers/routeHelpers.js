const Joi = require("joi");

// helper to validate the inputs
module.exports = {
  validateBody: (schema) => {
    return (req, res, next) => {
      console.log("Validating");
      const result = schema.validate(req.body);
      console.log(result);
      if (result.error) {
        return res.status(400).json(result.error);
      }
      if (!req.value) {
        req.value = {};
      }
      req.value["body"] = result.value;
      console.log(req.value["body"]);
      next();
    };
  },
  schemas: {
    authSchema: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  },
};
