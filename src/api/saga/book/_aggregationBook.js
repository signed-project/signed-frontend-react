
import getPostStream from './_getPostStream';
// import getHashedPost from './_getHashedPost';
import { getHash } from '../../../libs/signature';



const getHashedData = (arr) => {
    let hashMap = new Map();
    arr.map(val => { hashMap.set(val.hash, val); });
    return hashMap;
}

const getPostsHashValid = (arr) => {
    const hashValidArr = arr.filter(post => post.hash === getHash(post))
    return hashValidArr;
}

const getLatestPost = (arr) => {
    let latestPost = new Map();
    arr.map(post => {
        const key = post.source.address + '&' + post.hash;
        latestPost.set(key, post)
    });
    return latestPost;
};

const getLatestSource = (arr) => {
    let hashMap = new Map();
    arr.map(val => { hashMap.set(val.address, val); });
    return hashMap;
}

export const getCashData = (posts, sources) => {
    const postHashValid = getPostsHashValid(posts);
    // TOOD: check 
    const sourcesHashValid = sources
    return {
        latestSource: getLatestSource(sourcesHashValid),
        hashedSource: getHashedData(sourcesHashValid),
        latestPost: getLatestPost(postHashValid),
        hashedPost: getHashedData(postHashValid),
        stream: getPostStream(postHashValid)
    }
}