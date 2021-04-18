import Joi from 'joi';
import Ajv, { ErrorObject } from 'ajv';
const ajv = new Ajv({ allErrors: true });

/* {
    type: "object",
    properties: {
        one: { type: 'string' },
        neone: { type: 'string' }
    },
    required: ["neone"],
}
 */



const sortRequireFields = (arr) => {


    /*  const schema = {
         type: "object",
         properties: {
             next: {
                 "$ref": "./next.json"
             },
             two: { type: "integer" },
             foo: { type: "integer" },
             bar: { type: "string" }
         },
         required: ["foo"],
         additionalProperties: false
     }
 
     const validate = ajv.compile(schema)
 
     const data = {
         next: {
             one: 'jkk',
             neone: 'djfsdd'
         },
         two: 23232,
         foo: 1,
         bar: "abc"
     }
 
     const valid = validate(data)
     console.log('@@@@@@@@@@@@@@@@@@@@valid@@@@@@@@@@@@@@@@@@@@', valid);
     if (!valid) console.log(validate.errors) */

    const strLiteral11 = 'parent.schema';
    const strLiteral = 'child.schema';


    // ajv.addSchema({
    //     "$id": 'parent.schema',
    //     "type": "object",
    //     "properties": {
    //         "foo": { "type": "string" },
    //         "bar": { "$ref": "child.schema" }
    //     }
    // });

    const child = {
        type: "object",
        "properties": {
            "sub1": { type: "string" },
            "sub2": { "type": "string" },
        }
    }

    ajv.addSchema({
        "$id": 'parent.schema',
        "type": "object",
        "properties": {
            "foo": { "type": "string" },
            "bar": child
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


    console.log(')))((((');
    console.log(is_parent({
        foo: "whatever",
        bar: {
            sub1: "sometext",
            sub2: '111'
        }
    }));



};



const sortPostUpdateAt = (arr) => {
    // arr.map(post => { })

}

const getPostStream = (arr) => {

    const resRequiredFields = sortRequireFields();
    // const resSignatureFields = sortSignatureFields();
    // const resUpdatedFields = sortUpdatedAtFields();

    // arr.map(post => { })
    return []
}


export const getCashData = (arr) => {
    const book = {
        latestSource: '',
        hashedSource: '',
        latestPost: '',
        HashedPost: '',
        stream: getPostStream()
    }

    console.log('@@@@@@@@@@@@postsArrays@@@@@@@@@@@@', arr);

    // const posts = postsArrays.flat();
    // console.log('posts', posts);
}