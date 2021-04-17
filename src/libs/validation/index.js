import Ajv, { ErrorObject } from 'ajv';
import { object } from 'joi';
const ajv = new Ajv({ allErrors: true, async: true });

/**
 * for combining schemas in docs use this way
 * @example 
 *    ajv.addSchema({
        "$id": 'parent.schema',
        "type": "object",
        "properties": {
            "foo": { "type": "string" },
            "bar": { "$ref": "child.schema" }
        }
    });


    ajv.addSchema({
        "$id": 'child.schema',
        type: "object",
        "properties": {
            "sub1": { type: "string" },
            "sub2": { "type": "string" },
        }
    });

    const is_parent = ajv.getSchema('parent.schema');
    const is_child = ajv.getSchema("child.schema");
 * 
 *   console.log(is_parent({
        foo: "whatever",
        bar: {
            sub1: "sometext",
            sub2: '111'
        }
    }));
  */


const sourceSchema = {
  type: "object",
  properties: {
    address: {},
    name: {}
  }
};

const contentSchema = {
  type: "object",
  properties: {
    url: { type: "string" },
    hash: { type: "string" }
  },
  required: ["url", 'hash'],
  additionalProperties: true
};

const avatarSchema = {
  type: "object",
  properties: {
    contentType: { type: "string" },
    content: contentSchema
  },
  required: ["url", 'hash'],
  additionalProperties: true
}

// TODO: required [...]
const hostSchema = {
  type: "object",
  properties: {
    fileStores: { type: "array", items: { type: "string" } },
    index: { type: "string" }
  }
}

const sourceSchema = {
  type: "object",
  properties: {
    address: { type: "string" },
    name: { type: "string" },
    updatedAt: { type: "integer" },
    avatar: avatarSchema,
    hosts: hostSchema,
    hash: { type: "string" }
  },
  required: ["address", "name", "updatedAt", "avatar", "hosts", "hash"],
  additionalProperties: true
}

const targetSchema = {
  type: "object",
  properties: {
    "sourceHash": { type: "string" },
    "postHash": { type: "string" }
  },
  required: ["sourceHash", "postHash"],
  additionalProperties: false
};

const postSchema = {
  type: "object",
  properties: {
    "source": sourceSchema,
    "id": { type: "string" },
    "type": { enum: ["post", "like", "repost", "reply"] },
    "createdAt": { type: "integer" },
    "updatedAt": { type: "integer" },
    "text": { type: "string" },
    "attachments": avatarSchema,
    "target": targetSchema,
    "signatures": { type: "string" },
    "likesCount": { type: "integer" },
    "repostsCount": { type: "integer" },
    "commentsCount": { type: "integer" },
    "hash": { type: "string" }
  },
  required: [
    "source", "id", "type", "createdAt", "updatedAt",
    "text", "attachments", "signatures", "likesCount",
    "repostsCount", "commentsCount", "hash"
  ],
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