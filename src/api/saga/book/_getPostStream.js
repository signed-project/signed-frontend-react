import { isPostFieldValid } from '../../../libs/validation';
import { isSignatureValid } from '../../../libs/signature';


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

    arr.map(post => {
        if (arr.filter(p => post.id === p.id).length > 1
            && !isAlreadyExist(post.id)) {
            samesPost = [];
            arr.filter(p => p.id === post.id).map(pt => {
                samesPost.push(pt);
                return pt;
            });
            uniquePost.push(samesPost)
        }
        else if (arr.filter(p => post.id === p.id).length === 1) {
            uniquePost.push([post])
        };
        return post;
    });

    const sortUniquePost = uniquePost.slice().map(post => {
        if (post.length > 1) {
            post.sort((a, b) => b.updatedAt - a.updatedAt)
            return post[0]
        } else return post[0];
    })

    return sortUniquePost
}

const getPostStream = (arr) => {
    const newArr = arr.filter(post => {
        if (isPostFieldValid(post) && isSignatureValid(post) && post.type !== 'reply') {
            return true
        }
        else {
            console.warn('isPostFieldValid.errors', isPostFieldValid.errors);
        }
    });
    return sortPostUpdateAt(newArr);
}


export default getPostStream;