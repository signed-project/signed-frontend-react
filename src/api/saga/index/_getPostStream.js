import { isPostFieldValid } from '../../../libs/validation';


const sortPostUpdateAt = (arr) => {
    let uniquePost = [];
    let samesPost = [];

    const isAlreadyExist = id => {
        let isExist = false;
        uniquePost.map(postArr => {
            if (postArr.length > 1 && postArr.filter(ps => ps.id = id).length > 1) {
                isExist = true
            }
            return postArr;
        });
        return isExist;
    };
    if (arr)
        arr.map(post => {
            if (arr.filter(p => post.id === p.id).length > 1
                && !isAlreadyExist(post.id)) {
                samesPost = [];
                arr.filter(p => p.id === post.id).map(pt => {
                    samesPost.push(pt);
                    return pt;
                });
                const samePostSort = samesPost.sort((a, b) => b.updatedAt - a.updatedAt)
                uniquePost.push(samePostSort[0])
            }
            else if (arr.filter(p => post.id === p.id).length === 1) {
                uniquePost.push(post)
            };
            return post;
        });

    const sortUniquePost = uniquePost.slice().sort((a, b) => b.updatedAt - a.updatedAt)

    // const sortUniquePost = uniquePost.slice().map(post => {
    //     if (post.length > 1) {
    //         post.sort((a, b) => b.updatedAt - a.updatedAt)
    //         return post[0]
    //     } else return post[0];
    // })
    return sortUniquePost
}
// && isSignatureValid({ data: post })
const getPostStream = (arr) => {
    const newArr = arr.filter(post => {
        if (isPostFieldValid(post) && post.type !== 'reply') {
            return true
        }
        else {
            console.warn('isPostFieldValid.errors', isPostFieldValid.errors);
            return false;
        }
    });
    // return newArr;
    return sortPostUpdateAt(newArr);
}

export default getPostStream;