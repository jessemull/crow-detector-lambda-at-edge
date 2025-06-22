import { CloudFrontRequest, CloudFrontRequestEvent } from "aws-lambda";
import { handler } from "./index";

const getMockEvent = (uri = "/admin", cookie?: string) =>
  ({
    Records: [
      {
        cf: {
          request: {
            uri,
            headers: cookie ? { cookie: [{ value: cookie }] } : {},
          },
        },
      },
    ],
  }) as unknown as CloudFrontRequestEvent;

describe("Blockbuster Index Lambda@Edge Handler", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    jest.clearAllMocks();
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it("should return the request for URIs", async () => {
    const event = getMockEvent("/");
    const result = await handler(event);
    expect(result).toEqual(event.Records[0].cf.request);
  });

  it("should normalize and append .html if no extension", async () => {
    const event = getMockEvent("/about");
    const result = (await handler(event)) as CloudFrontRequest;
    expect(result?.uri).toBe("/about.html");
  });

  it("should preserve query string when adding .html", async () => {
    const event = getMockEvent("/about?foo=bar");
    const result = (await handler(event)) as CloudFrontRequest;
    expect(result?.uri).toBe("/about.html?foo=bar");
  });

  it("should handle uri with trailing slashes", async () => {
    const event = getMockEvent("/about////");
    const result = (await handler(event)) as CloudFrontRequest;
    expect(result?.uri).toBe("/about.html");
  });
});
