// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import { RepresentationHeader, toHashString } from "./deps.ts";
import { FailBy } from "./constants.ts";
import { quote, reason } from "./utils.ts";

export interface Options {
  /** Function to calculate hash values. The data is passed the actual response body value.
   * @default {@link digestSHA1}
   */
  readonly digest?: Digest;
}

/** Function to calculate hash values. */
export interface Digest {
  (data: ArrayBuffer): ArrayBuffer | Promise<ArrayBuffer>;
}

const digestSHA1: Digest = (data: ArrayBuffer) =>
  crypto.subtle.digest("sha-1", data);

export async function withEtag(
  response: Response,
  options?: Options,
): Promise<Response> {
  if (
    response.bodyUsed ||
    response.headers.has(RepresentationHeader.ETag)
  ) {
    return response;
  }

  const { digest = digestSHA1 } = options ?? {};
  const etag = await response
    .clone()
    .arrayBuffer()
    .catch(reason(FailBy.Fetch))
    .then(digest)
    .catch(reason(FailBy.CalcHash))
    .then(toHashString)
    .catch(reason(FailBy.CalcHashString))
    .then(quote);
  const res = response.clone();

  res.headers.set(RepresentationHeader.ETag, etag);

  return res;
}
