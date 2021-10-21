import getPostStream from './getPostStream';
import { getHash, isSignatureValid } from './signature';



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


const getLatestPost = (arr) => {
    let latestPost = new Map();
    arr.map(post => {
        const key = post.source.address + '*' + post.id;
        latestPost.set(key, post)
        return post
    });
    return Object.fromEntries(latestPost);
};





// ! TODO add unit test 
const getLatestSource = (arr) => {
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

const getArrWithUniqItem = ({ arr }) => {
    let hashMap = new Map();
    arr.map(val => {
        hashMap.set(val.hash, val);
    })
    return Array.from(hashMap.values());
}

const getHashedTargetPost = (posts) => {
    const hashedPosts = posts.filter(p => p.type === 'post');
    return hashedPosts.map(p => {
        const replyPost = posts.filter(pst => p.hash === pst.target.postHash)
        return { [p.hash]: replyPost }
    }).filter(val => {
        console.log('Object.entries(val)[1]', Object.entries(val)[0][1]);
        return Object.entries(val)[0][1]?.length > 0
    })
}


export const buildStream = ({ arrPosts, arrSources }) => {
    const postHashValid = getDataHashValid(arrPosts);
    const sourcesHashValid = getDataHashValid(arrSources);

    const postSignatureValid = getDataSignatureValid({ arr: postHashValid, isPost: true });
    const sourcesSignatureValid = getDataSignatureValid({ arr: sourcesHashValid, isPost: false });

    const postValidUniq = getArrWithUniqItem({ arr: postSignatureValid });
    const sourcesValidUniq = getArrWithUniqItem({ arr: sourcesSignatureValid });

    return {
        latestSource: getLatestSource(sourcesValidUniq),
        hashedSource: getHashedData(sourcesValidUniq),
        latestPost: getLatestPost(postValidUniq),
        hashedPost: getHashedData(postValidUniq),
        hashedTargetPost: getHashedTargetPost(postValidUniq),
        stream: getPostStream(postValidUniq)
    }
}
