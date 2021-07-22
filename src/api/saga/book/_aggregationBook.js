
import getPostStream from './_getPostStream';
import { getHash, isSignatureValid } from '../../../libs/signature';



const getHashedData = (arr) => {
    let hashMap = new Map();
    arr.map(val => { hashMap.set(val.hash, val); return val });
    return Object.fromEntries(hashMap);
}

const getDataHashValid = (arr) => {
    return Array.isArray(arr) ?
        arr.filter(obj => {
            return obj.hash === getHash({ data: obj })
        })
        : [];
}

const getDataSignatureValid = ({ arr, isPost = false }) => {
    return Array.isArray(arr) ?
        arr.filter(obj => {
            let address = isPost ? obj.source.address : obj.address;
            return isSignatureValid({ data: obj, address: address })
        })
        : [];
}

const getLatestPost = (arr) => {
    let latestPost = new Map();
    arr.map(post => {
        const key = post.source.address + '*' + post.hash;
        latestPost.set(key, post)
        return post
    });
    return Object.fromEntries(latestPost);
};

const getPostUpdateAtFilter = (arr) => {
    let result = [];
    if (!Array.isArray(arr)) return result;

    // arr.map(src => { })


}


const getLatestSource = (arr) => {
    // sort for apdate at, check signature




    let hashMap = new Map();
    arr.map(val => {
        hashMap.set(val.address, val)
        return val
    });
    return Object.fromEntries(hashMap);
}

export const getCashData = ({ arrPosts, arrSources }) => {
    const postHashValid = getDataHashValid(arrPosts);
    const sourcesHashValid = getDataHashValid(arrSources);

    const postSignatureValid = getDataSignatureValid({ arr: postHashValid, isPost: true });
    const sourcesSignatureValid = getDataSignatureValid({ arr: sourcesHashValid, isPost: false });

    return {
        latestSource: getLatestSource(sourcesSignatureValid),
        hashedSource: getHashedData(sourcesSignatureValid),
        latestPost: getLatestPost(postSignatureValid),
        hashedPost: getHashedData(postSignatureValid),
        stream: getPostStream(postSignatureValid)
    }
}