const Ajv = require("ajv");
const { postSchema, sourceSchema } = require("./schemas.js");

const ajv = new Ajv({ allErrors: true, async: true });

/**
 * @tutorial combining schemas in docs use this way
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
 other_way to get validate instance is
ajv.addSchema(schema_user, "user")
const validate = ajv.getSchema("user")
*
* @param  {validate.errors}  - get errors validation 
*
*/

module.exports = {
  isValidSourceFields: ajv.compile(sourceSchema),
  isValidPostFields: ajv.compile(postSchema),
};
