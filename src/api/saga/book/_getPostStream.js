import { isPostFieldValid } from '../../../libs/validation';
import { isSignatureValid } from '../../../libs/signature';




/**
 *  find out post what hame some id, but different updatedAt, and get new one
 */
const sortPostUpdateAt = (arr) => {
    let uniquePost = [];
    let samesPost = [];

    const isAlreadyExist = id => {
        let isExist = false;
        uniquePost.map(postArr => {
            if (postArr.length > 1 && postArr.filter(ps => ps.id = id).length > 1) {
                isExist = true
            }
        });
        return isExist;
    };

    arr.map(post => {
        if (arr.filter(p => post.id === p.id).length > 1
            && !isAlreadyExist(post.id)) {
            samesPost = [];
            arr.filter(p => p.id === post.id).map(pt => {
                samesPost.push(pt);
            });
            uniquePost.push(samesPost)
        }
        else if (arr.filter(p => post.id === p.id).length === 1) {
            uniquePost.push([post])
        };
    });

    const sortUniquePost = uniquePost.slice().map(pst => {
        if (pst.length > 1) {
            pst.sort((a, b) => a.updatedAt - b.updatedAt)
            return pst[0]
        } else return pst[0];
    })

    return sortUniquePost
}

const getPostStream = (arr) => {
    const newArr = arr.filter(post => {
        if (isPostFieldValid(post) && isSignatureValid(post) && post.type !== 'reply') {
            console.log('post.type', post.type);
            return post
        }
        else {
            console.log('');

        }
    });
    console.log('newArr', newArr);
    return sortPostUpdateAt(newArr);
    // return newArr;
}


export default getPostStream;