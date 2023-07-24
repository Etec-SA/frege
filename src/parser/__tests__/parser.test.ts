import assert from "node:assert";
import { describe, it, beforeEach } from "node:test";
import { Parser } from "../Parser";
import { Negation, UnaryOperation } from "src/types/operations/unary-operation";

describe('Parser', ()=>{
    let parser: Parser;

    beforeEach(()=>{
        parser = new Parser([]);
    });

    it('should be defined', ()=>{
        assert.ok(parser);
    });

    it('should parse ¬P', ()=>{
        const expected: Negation = {
            operation: 'Negation',
            value: 'P'
        };

        parser.tokens = [
            {type: 'operator', value: '¬'},
            {type: 'variable', value: 'P'}
        ];

        const result = parser.parse() as UnaryOperation;

        assert.deepEqual(result, expected);
        assert.equal(result.operation, 'Negation');
    });
});