import { getStreamPage } from "./../../api/customNpmPackage/signedLoader";

export const handleSwitchPages = ({
  element,
  postsStream,
  isAuth,
  next,
  postsSource,
  subscribedSources,
  subscribed,
  userSource,
  blacklistedSourcesByAddress,
  limit,
  callbackForUpdateStream,
  callbackForUpdatePostsNumber,
}) => {
  let sources = [];

  if (!postsSource) {
    if (!isAuth) {
      sources = subscribedSources.slice();
    } else {
      sources = [...subscribed, userSource];
    }
  }

  const post = postsStream[next ? postsStream.length - 1 : 0].rootPost;

  const stream = getStreamPage({
    postsSource,
    subscribedSources: sources,
    blacklistedSourcesByAddress,
    afterPost: next ? post : {},
    endPost: !next ? post : {},
    limit,
    callbackForUpdateStream,
    callbackForUpdatePostsNumber,
  });

  callbackForUpdateStream({ stream });

  element?.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
