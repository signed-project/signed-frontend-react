import Ajv from "ajv";
const ajv = new Ajv({ allErrors: true, async: true });

export const schemaId = {
  post: "validation//post",
  target: "validation//target",
  source: "validation//source",
  host: "validation//host",
  media: "validation//media",
  signatureItemSchema: "validation//signatureItemSchema",
};

const signatureItemSchema = {
  $id: schemaId.signatureItemSchema,
  type: "object",
  properties: {
    signature: { type: "string" },
    address: { type: "string" },
  },
  required: ["signature", "address"],
  additionalProperties: false,
};

const mediaSchema = {
  $id: schemaId.media,
  type: "object",
  properties: {
    contentType: { type: "string" },
    hash: { type: "string" },
    width: { type: "string" },
    height: { type: "string" },
    // thumbnail: { type: mediaSchema },
    url: { type: "string" },
  },
  // required: ["contentType", "hash"],
  additionalProperties: true,
};

export const hostSchema = {
  $id: schemaId.host,
  type: "object",
  properties: {
    assets: { type: "string" },
    index: { type: "string" },
  },
};
//   assets: { type: "array", items: { type: "string" } },
export const sourceSchema = {
  $id: schemaId.source,
  type: "object",
  properties: {
    address: { type: "string" },
    updatedAt: { type: "integer" },
    hosts: {
      type: "array",
      items: hostSchema,
    },
    hash: { type: "string" },
  },
  required: ["address", "updatedAt", "avatar", "hosts", "hash"],
  additionalProperties: true,
};

const targetSchema = {
  $id: schemaId.target,
  type: "object",
  properties: {
    sourceHash: { type: "string" },
    postHash: { type: "string" },
  },
  required: ["sourceHash", "postHash"],
  additionalProperties: false,
};

const postSchema = {
  $id: schemaId.post,
  type: "object",
  properties: {
    source: sourceSchema,
    id: { type: "string" },
    type: { enum: ["post", "like", "repost", "reply"] },
    createdAt: { type: "integer" },
    updatedAt: { type: "integer" },
    text: { type: "string" },
    attachments: { type: "array", items: mediaSchema },
    signatures: { type: "array", items: signatureItemSchema },
    // "signatures": { type: "array", items: { type: "string" } },
    // "signatures": { type: "string" },
    likesCount: { type: "integer" },
    repostsCount: { type: "integer" },
    commentsCount: { type: "integer" },
    hash: { type: "string" },
  },
  anyOf: [
    {
      properties: {
        target: targetSchema,
      },
    },
    {
      properties: {
        target: {
          type: "string",
          maxLength: 0,
        },
      },
    },
  ],
  required: [
    "source",
    "id",
    "type",
    "createdAt",
    "updatedAt",
    "text",
    "signatures",
    "likesCount",
    "repostsCount",
    "commentsCount",
    "hash",
  ],
  additionalProperties: true,
};

export const isSource = ajv.compile(sourceSchema);
export const isPostFieldValid = ajv.compile(postSchema);
