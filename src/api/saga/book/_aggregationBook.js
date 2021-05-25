
import getPostStream from './_getPostStream';
import { getHash } from '../../../libs/signature';



const getHashedData = (arr) => {
    let hashMap = new Map();
    arr.map(val => { hashMap.set(val.hash, val); return val });
    return Object.fromEntries(hashMap);
}

const getPostsHashValid = (arr) => {
    const hashValidArr = arr.filter(post => post.hash === getHash(post))
    return hashValidArr;
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

const getLatestSource = (arr) => {
    let hashMap = new Map();
    arr.map(val => {
        hashMap.set(val.address, val)
        return val
    });
    return Object.fromEntries(hashMap);
}

export const getCashData = (posts, sources) => {
    const postHashValid = getPostsHashValid(posts);
    // TOOD: check sourcesHashValid add react signatures to source
    const sourcesHashValid = sources;
    return {
        latestSource: getLatestSource(sourcesHashValid),
        hashedSource: getHashedData(sourcesHashValid),
        latestPost: getLatestPost(postHashValid),
        hashedPost: getHashedData(postHashValid),
        stream: getPostStream(postHashValid)
    }
}