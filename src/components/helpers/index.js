import { getStreamPage } from "./../../api/customNpmPackage/signedLoader";

export const handleSwitchPages = ({
  element,
  postsStream,
  isAuth,
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

  const post = postsStream[postsStream.length - 1].rootPost;

  const stream = getStreamPage({
    postsSource,
    subscribedSources: sources,
    blacklistedSourcesByAddress,
    afterPost: post,
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
