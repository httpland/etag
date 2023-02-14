import {
  assert,
  assertEquals,
  describe,
  equalsResponse,
  it,
  Status,
} from "./_dev_deps.ts";
import { withEtag } from "./etag.ts";

const ETAG = `"7a85f4764bbd6daf1c3545efbbf0f279a6dc0beb"`;

describe("withEtag", () => {
  it("should return with etag header field if the response does not have etag field", async () => {
    const initResponse = new Response("ok");
    const response = await withEtag(
      new Request("http://localhost"),
      initResponse,
    );
    assertEquals(response.headers.get("etag"), ETAG);
    assertEquals(initResponse.headers.get("etag"), null);
    assertEquals(initResponse.bodyUsed, false);
  });

  it("should return 304 response if the request if-none-match header field and match etag", async () => {
    const initResponse = new Response("ok", {
      headers: { "content-length": "2" },
    });
    const response = await withEtag(
      new Request("http://localhost", {
        headers: { "if-none-match": ETAG },
      }),
      initResponse,
    );

    assert(
      equalsResponse(
        response,
        new Response(null, { status: Status.NotModified }),
      ),
    );
    assertEquals(initResponse.headers.get("etag"), null);
    assertEquals(initResponse.bodyUsed, false);
  });

  it("should return new etag field value if the etag does not match", async () => {
    const initResponse = new Response("ok");
    const response = await withEtag(
      new Request("http://localhost", {
        headers: { "if-none-match": "not match" },
      }),
      initResponse,
    );
    assertEquals(response.status, Status.OK);
    assertEquals(await response.text(), "ok");
    assertEquals(response.headers.get("etag"), ETAG);
  });

  it("should use custom digest", async () => {
    const initResponse = new Response("ok");
    const response = await withEtag(
      new Request("http://localhost", {
        headers: { "if-none-match": "not match" },
      }),
      initResponse,
      { digest: (data) => crypto.subtle.digest("sha-256", data) },
    );
    assertEquals(response.status, Status.OK);
    assertEquals(await response.text(), "ok");
    const SHA256 =
      `"2689367b205c16ce32ed4200942b8b8b1e262dfc70d9bc9fbc77c49699a4f1df"`;
    assertEquals(response.headers.get("etag"), SHA256);
  });
});
