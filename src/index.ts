import path from "path";
import { CloudFrontRequestEvent, CloudFrontRequestResult } from "aws-lambda";

export const handler = async (
  event: CloudFrontRequestEvent,
): Promise<CloudFrontRequestResult> => {
  const request = event.Records[0].cf.request;
  const headers = request.headers || {};

  // Redirect non-canonical domain to canonical domain (blockbusterindex.com -> www.blockbusterindex.com)...

  const hostHeader = headers["host"]?.[0]?.value;
  if (hostHeader === "blockbusterindex.com") {
    const protocol =
      headers["cloudfront-forwarded-proto"]?.[0]?.value || "https";
    let requestPath = request.uri || "/";
    let redirectPath: string;

    if (requestPath === "/") {
      redirectPath = "/";
    } else {
      const [uriWithoutQuery] = requestPath.split("?");
      const normalizedUri = path
        .normalize(decodeURIComponent(uriWithoutQuery))
        .replace(/\/+$/, "")
        .toLowerCase();
      const hasExtension = /\.[a-zA-Z0-9]+$/.test(normalizedUri);
      redirectPath = hasExtension ? normalizedUri : `${normalizedUri}.html`;
    }
    const querystring = request.querystring ? `?${request.querystring}` : "";
    return {
      status: "301",
      statusDescription: "Moved Permanently",
      headers: {
        location: [
          {
            key: "Location",
            value: `${protocol}://www.blockbusterindex.com${redirectPath}${querystring}`,
          },
        ],
      },
    };
  }

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
