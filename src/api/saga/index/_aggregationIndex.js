
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
};

// const getPostSignatureValid = ({ arr, isPost = false }) => {
//     return Array.isArray(arr) ?
//         arr.filter(obj => {
//             return isSignatureArrValid({ data: obj, address: address })
//         })
//         : [];
// };

const getLatestPost = (arr) => {
    let latestPost = new Map();
    arr.map(post => {
        const key = post.source.address + '*' + post.hash;
        latestPost.set(key, post)
        return post
    });
    return Object.fromEntries(latestPost);
};





// ! TODO add unit test 
const getLatestSource = (arr) => {
    // sort for apdate at, check signature
    let uniqueArr = [];
    let samesArr = [];

    const isAlreadyExist = address => {
        let isExist = false;
        uniqueArr.map(uArr => {
            if (uArr.length > 1 && uArr.filter(src => src.address = address).length > 1) {
                isExist = true
            }
            return uArr;
        });
        return isExist;
    };

    arr.map(source => {
        if (arr.filter(s => source.address === s.address).length > 1
            && !isAlreadyExist(source.address)) {
            samesArr = [];
            arr.filter(s => s.address === source.address).map(src => {
                samesArr.push(src);
                return src;
            });
            const samePostSort = samesArr.sort((a, b) => b.updatedAt - a.updatedAt)
            uniqueArr.push(samePostSort[0])
        }

        else if (arr.filter(s => source.address === s.address).length === 1) {
            uniqueArr.push(source)
        };
        return source;
    });

    let hashMap = new Map();
    arr.map(val => {
        hashMap.set(val.address, val)
        return val
    });
    return Object.fromEntries(hashMap);
}

export const getCashData = ({ arrPosts, arrSources }) => {

    const postHashValid = getDataHashValid(arrPosts);
    console.log('postHashValid[getCashData]', postHashValid.length);
    const sourcesHashValid = getDataHashValid(arrSources);

    const postSignatureValid = getDataSignatureValid({ arr: postHashValid, isPost: true });
    console.log('postSignatureValid', postSignatureValid.length);
    const sourcesSignatureValid = getDataSignatureValid({ arr: sourcesHashValid, isPost: false });

    return {
        latestSource: getLatestSource(sourcesSignatureValid),
        hashedSource: getHashedData(sourcesSignatureValid),
        latestPost: getLatestPost(postSignatureValid),
        hashedPost: getHashedData(postSignatureValid),
        stream: getPostStream(postSignatureValid)
    }
}