const getCommentTrees = ({ targetHashMap, currentPostHash }) => {
  let comments = [];
  const foundCommentsByHash = targetHashMap[currentPostHash];

  if (foundCommentsByHash) {
    comments = foundCommentsByHash.slice();
  }

  const commentsDateFilter = comments.sort((a, b) => a.createdAt - b.createdAt);
  return commentsDateFilter;
};

export default getCommentTrees;
