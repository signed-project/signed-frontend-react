import Ajv, { ErrorObject } from 'ajv';
const ajv = new Ajv({ allErrors: true });


const sourceSchema = {
  type: "object",
  properties: {
    address: {},
    name: {}
  }
}


const PostSchema = {
  type: "object",
  properties: {
    next: {
      type: "object",
      properties: {
        one: { type: 'string' },
        neone: { type: 'string' }
      },
      additionalProperties: false
    },
    two: { type: "integer" },
    foo: { type: "integer" },
    bar: { type: "string" }
  },
  required: ["foo"],
  additionalProperties: true
}

const validate = ajv.compile(schema)

const data = {
  next: {
    one: 'jkk',
  },
  two: 23232,
  foo: 1,
  bar: "abc"
}

const valid = validate(data)
console.log('valid', valid);
if (!valid) console.log(validate.errors)