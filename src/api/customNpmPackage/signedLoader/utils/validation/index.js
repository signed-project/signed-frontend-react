import { getHash, isSignatureValid } from "./signature";
import { isValidPostFields, isValidSourceFields } from "./schemas";

export const validatePost = ({ post }) => {
  if (!isValidPostFields(post) && post.type !== "reply") {
    console.warn("isValidPostFields.errors", isValidPostFields.errors);
    return false;
  }

  if (post.hash !== getHash({ data: post })) {
    console.warn("is not valid post.hash", post.hash);
    return false;
  }

  if (!isSignatureValid({ data: post, address: post.source.address })) {
    console.warn(
      "is not valid (signature) post.source.address",
      post.source.address
    );
    return false;
  }

  return true;
};

export const validateSource = ({ source }) => {
  if (!isValidSourceFields(source)) {
    console.warn("isValidSourceFields.errors", isValidSourceFields.errors);
    return false;
  }

  if (source.hash !== getHash({ data: source })) {
    console.warn("is not valid source.hash", source.hash);
    return false;
  }

  if (!isSignatureValid({ data: source, address: source.address })) {
    console.warn("is not valid (signature) source.address", source.address);
    return false;
  }

  return true;
};
