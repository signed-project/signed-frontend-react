import Joi from 'joi';

/**
 * Validator class for object structure validation.
 */
class Validator {
  constructor(schema, config = Validator.getDefaultConfig()) {
    this.schema = null;
    this.config = config;
    this.setSchema(schema, config);
  }

  static get Joi() {
    return Joi;
  }

  static getDefaultConfig() {
    return {
      abortEarly: false,
      convert: true,
      presence: 'required',
      errors: {
        wrap: {
          label: false,
        },
      },
    };
  }

  static get Presets() {
    return {
      email: Joi.string().email({ tlds: { allow: false } }),
      password: Validator.Joi.string().min(3).max(128).label('Password'),
      repeatedPassword: (refName = 'password') =>
        Validator.Joi.string().valid(Validator.Joi.ref(refName)),
    };
  }

  setConfig(config) {
    const { required = true, ...rest } = config;
    const validatorConfig = {
      presence: required ? 'required' : 'optional',
      ...rest,
    };
    this.config = Object.assign({}, this.config, validatorConfig);
  }

  setSchema(schema, config = Validator.getDefaultConfig()) {
    this.setConfig(config);

    if (schema instanceof Function) {
      const schemaObj = schema(Joi);

      try {
        this.schema = Joi.object(schemaObj);
      } catch (error) {
        this.schema = schemaObj;
      }

      return this;
    }

    if (Array.isArray(schema)) {
      let validationSchema = {};

      schema.forEach((setting) => {
        validationSchema[setting] = Joi.any();
      });
      this.schema = Joi.object(validationSchema);

      return this;
    }

    if (schema instanceof Object) {
      try {
        this.schema = Joi.object(schema);
      } catch (error) {
        this.schema = schema;
      }

      return this;
    }

    return this;
  }

  validate(data) {
    if (this.schema) return this.schema.validate(data, this.config);
    return { value: null, error: null };
  }
}

export default Validator;
