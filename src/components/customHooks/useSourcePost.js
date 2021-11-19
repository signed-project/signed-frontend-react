import { useState, useEffect } from "react";
import { getAllSources } from "./../../api/customNpmPackage/signedLoader";

const useSourcePost = (address) => {
  const latestSources = getAllSources();
  const [sourceLatest, setSourceLatest] = useState();

  useEffect(() => {
    if (address) {
      setSourceLatest(latestSources[address]);
    }
  }, [latestSources, address]);

  return sourceLatest;
};
export default useSourcePost;
