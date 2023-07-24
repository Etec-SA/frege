import assert from "node:assert";
import { describe, it, beforeEach } from "node:test";
import { Parser } from "../Parser";
import { Negation, UnaryOperation } from "src/types/operations/unary-operation";
import { Biconditional, BinaryOperation, Conjunction, Implication } from "src/types/operations/binary-operations";

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

    it('should parse P -> Q', ()=>{
        const expected: Implication = {
            operation: 'Implication',
            left: 'P',
            right: 'Q'
        };

        parser.tokens = [
            {type: 'variable', value: 'P'},
            {type: 'operator', value: '->'},
            {type: 'variable', value: 'Q'}
        ];

        const result = parser.parse() as BinaryOperation;

        assert.deepEqual(result, expected);
        assert.equal(result.operation, 'Implication');
    });

    it('should parse P <-> Q', ()=>{
        const expected: Biconditional = {
            operation: 'Biconditional',
            left: 'P',
            right: 'Q'
        };

        parser.tokens = [
            {type: 'variable', value: 'P'},
            {type: 'operator', value: '<->'},
            {type: 'variable', value: 'Q'}
        ];

        const result = parser.parse() as BinaryOperation;

        assert.deepEqual(result, expected);
        assert.equal(result.operation, 'Biconditional');
    });

    it('should parse P ∧ Q', ()=>{
        const expected: Conjunction = {
            operation: 'Conjunction',
            left: 'P',
            right: 'Q'
        };

        parser.tokens = [
            {type: 'variable', value: 'P'},
            {type: 'operator', value: '∧'},
            {type: 'variable', value: 'Q'}
        ];

        const result = parser.parse() as BinaryOperation;

        assert.deepEqual(result, expected);
        assert.equal(result.operation, 'Conjunction');
    });
});