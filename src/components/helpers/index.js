import { getStreamPage } from "./../../api/customNpmPackage/signedLoader";

export const handleSwitchPages = ({
  postsStream,
  next,
  isAuth,
  postsSource,
  subscribedSources,
  subscribed,
  userSource,
  blacklistedSourcesByAddress,
  limit,
  callback,
}) => {
  let sources = [];

  if (!isAuth) {
    sources = subscribedSources.slice();
  } else {
    sources = [...subscribed, userSource];
  }

  const post = postsStream.at(next ? -1 : 0).rootPost;

  const stream = getStreamPage({
    postsSource,
    subscribedSources: sources,
    blacklistedSourcesByAddress,
    afterPost: next ? post : {},
    endPost: !next ? post : {},
    limit,
    callback: callback,
  });

  callback({ stream });

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
