
const getCommentTreas = ({ hashMap, currentHash }) => {
    const postArr = Object.values(hashMap);
    const comments = [];
    const recursion = (hash) => {
        postArr.map(post => {
            if (post.target.postHash === hash && post.type === 'reply') {
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