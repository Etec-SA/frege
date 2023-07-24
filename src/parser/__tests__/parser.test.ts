import assert from "node:assert";
import { describe, it, beforeEach } from "node:test";
import { Parser } from "../Parser";

describe('Parser', ()=>{
    let parser: Parser;

    beforeEach(()=>{
        parser = new Parser([]);
    });

    it('should be defined', ()=>{
        assert.ok(parser);
    });
});