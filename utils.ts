// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import { compareEtag, trim } from "./deps.ts";

/** Catch error utility. */
export function reason(message: string): (cause: unknown) => never {
  return (cause) => {
    throw Error(message, { cause });
  };
}

export function ifNoneMatch(fieldValue: string, etag: string): boolean {
  fieldValue = fieldValue.trim();

  if (isStar(fieldValue)) return false;

  const matched = fieldValue
    .split(",")
    .map(trim)
    .filter(Boolean)
    .some(matchEtag);

  return matched;

  function matchEtag(input: string): boolean {
    return compareEtag(input, etag);
  }
}

/** Whether the input is `*` or not. */
function isStar(input: string): input is "*" {
  return input === "*";
}

export function quote<T extends string>(input: T): `"${T}"`;
export function quote(input: string): string;
export function quote(input: string): string {
  return `"${input}"`;
}
