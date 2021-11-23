import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getPostByHash } from "./../../api/customNpmPackage/signedLoader";

const useTargetPost = (postHash) => {
  const subscribedSources = useSelector((state) => state.source.subscribed);
  const [targetPost, setTargetPost] = useState({});

  useEffect(() => {
    if (postHash) {
      setTargetPost(getPostByHash({ hash: postHash, subscribedSources }));
    }
  }, [subscribedSources, postHash]);

  return targetPost;
};

export default useTargetPost;
