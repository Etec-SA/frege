import assert from "node:assert";
import { describe, it } from "node:test";
import frege from "src/index";

describe('frege.reduce', ()=>{
    it('should be defined', ()=>{
        assert.ok(frege.reduce);
    });
})