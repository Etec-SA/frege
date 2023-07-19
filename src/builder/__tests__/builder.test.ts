import assert from "assert/strict";
import { describe, it } from "node:test";
import { builder } from "../Builder";

describe('Builder', () => {
  it('should be defined', () => {
    assert.ok(builder);
  });
})
