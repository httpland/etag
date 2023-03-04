import {
  assert,
  assertEquals,
  describe,
  equalsResponse,
  it,
  RepresentationHeader,
  Status,
} from "./_dev_deps.ts";
import { withEtag } from "./transform.ts";

const ETAG = `"7a85f4764bbd6daf1c3545efbbf0f279a6dc0beb"`;

describe("withEtag", () => {
  it("should return with etag header field if the response does not have etag field", async () => {
    const initResponse = new Response("ok");
    const response = await withEtag(initResponse);

    assert(
      await equalsResponse(
        response,
        new Response("ok", { headers: { [RepresentationHeader.ETag]: ETAG } }),
        true,
      ),
    );
  });

  it("should use custom digest", async () => {
    const initResponse = new Response("ok");
    const response = await withEtag(initResponse, {
      digest: (data) => crypto.subtle.digest("sha-256", data),
    });
    assertEquals(response.status, Status.OK);
    assertEquals(await response.text(), "ok");
    const SHA256 =
      `"2689367b205c16ce32ed4200942b8b8b1e262dfc70d9bc9fbc77c49699a4f1df"`;
    assertEquals(response.headers.get("etag"), SHA256);
  });

  it("should return same response if the response has been read", async () => {
    const initResponse = new Response("ok");

    await initResponse.text();
    const response = await withEtag(initResponse);

    assert(initResponse.bodyUsed);
    assertEquals(initResponse, response);
  });

  it("should return same response if the response has etag header", async () => {
    const initResponse = new Response("ok", {
      headers: { [RepresentationHeader.ETag]: "" },
    });

    const response = await withEtag(initResponse);

    assertEquals(initResponse, response);
  });
});
