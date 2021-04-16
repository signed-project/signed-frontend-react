import Joi from 'joi';
import Ajv, { ErrorObject } from 'ajv';
const ajv = new Ajv({ allErrors: true });




const sortRequireFields = (arr) => {
    const schema = {
        type: "object",
        properties: {
            next: {
                type: "object",
                properties: {
                    one: { type: 'string' },
                    neone: { type: 'string' }
                },
                required: ["neone"],
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
            // neone: 'djfsdd'
        },
        two: 23232,
        foo: 1,
        bar: "abc"
    }

    const valid = validate(data)
    console.log('valid', valid);
    if (!valid) console.log(validate.errors)


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