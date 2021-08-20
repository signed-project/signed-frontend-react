
const getCommentTreas = ({ hashMap, currentHash }) => {
    const postArr = Object.values(hashMap);
    const comments = [];

    console.log('hashMap', hashMap);
    console.log('currentHash', currentHash);

    const recursion = (hash) => {
        postArr.map(post => {
            if (post.target.postHash === hash && post.type === 'reply') {
                console.log('post.target.postHash', post.target.postHash);
                comments.push(post);
                recursion(post.hash);
            }
            return post;
        })
    }
    recursion(currentHash);
    const commentsDateFilter = comments.sort((a, b) => a.createdAt - b.createdAt);
    return commentsDateFilter
}


export default getCommentTreas;