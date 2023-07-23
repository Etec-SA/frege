import assert from "assert";
import { describe, it, beforeEach } from "node:test";
import { Lexer } from "../Lexer";

let lexer: Lexer;

describe('Lexer', ()=>{
    beforeEach(()=>{
        lexer = new Lexer('');
    });

    it('should be defined', ()=>{
        assert.ok(lexer);
    });
})