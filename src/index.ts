import path from "path";
import { CloudFrontRequestEvent, CloudFrontRequestResult } from "aws-lambda";

export const handler = async (
  event: CloudFrontRequestEvent,
): Promise<CloudFrontRequestResult> => {
  const request = event.Records[0].cf.request;

  if (request.uri === "/") {
    request.uri = "/index.html";
  }

  let uri = request.uri;

  const [uriWithoutQuery] = uri.split("?");

  const normalizedUri = path
    .normalize(decodeURIComponent(uriWithoutQuery))
    .replace(/\/+$/, "")
    .toLowerCase();

  const hasExtension = /\.[a-zA-Z0-9]+$/.test(normalizedUri);

  if (!hasExtension) {
    uri = `${normalizedUri}.html${uri.includes("?") ? "?" + uri.split("?")[1] : ""}`;
  }

  request.uri = uri;

  return request;
};
