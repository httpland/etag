import { assertEquals, describe, it, Status } from "./_dev_deps.ts";
import { withEtag } from "./etag.ts";

const ETAG = "6277173b";

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
    const initResponse = new Response("ok");
    const response = await withEtag(
      new Request("http://localhost", {
        headers: { "if-none-match": ETAG },
      }),
      initResponse,
    );
    assertEquals(response.status, Status.NotModified);
    assertEquals(await response.text(), "");

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
});
