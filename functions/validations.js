const Joi = require("joi");

const victimsFilterSchema = Joi.object({
  radius: Joi.object({
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    distance: Joi.number().required(),
    unit: Joi.string().valid("KM", "MI").required(),
  }),
  polygon: Joi.object({
    vertices: Joi.array()
      .min(3)
      .items(Joi.array().max(2).items(Joi.number()))
      .required(),
  }),
  time: Joi.object({
    from: Joi.date().iso().less(Joi.ref("to")).required(),
    to: Joi.date().iso().less("now"),
  }),
}).nand("radius", "polygon");

const volunteerFilterSchema = victimsFilterSchema.keys({
  type: Joi.string().valid("Independent", "ProSAR"),
});

const medicalInfoSchema = Joi.object({
  victimIds: Joi.array().min(1).items(Joi.string()).required(),
});

module.exports = {
  victimsFilterSchema,
  medicalInfoSchema,
  volunteerFilterSchema,
};
