import assert from 'node:assert';
import { describe, it, beforeEach } from 'node:test';
import { Parser } from '../Parser';
import {
  Negation,
  UnaryOperation,
  Implication,
  BinaryOperation,
  Biconditional,
  Conjunction,
  Disjunction,
} from 'types';

describe('Parser', () => {
  let parser: Parser;
  beforeEach(() => {
    parser = new Parser([]);
  });

  it('should be defined', () => {
    assert.ok(parser);
  });

  it('should parse ¬P', () => {
    const expected: Negation = {
      operation: 'Negation',
      value: 'P',
    };

    parser.tokens = [
      { type: 'operator', value: '¬' },
      { type: 'variable', value: 'P' },
    ];

    const result = parser.parse() as UnaryOperation;

    assert.deepEqual(result, expected);
    assert.equal(result.operation, 'Negation');
  });

  it('should parse !P', () => {
    const expected: Negation = {
      operation: 'Negation',
      value: 'P',
    };

    parser.tokens = [
      { type: 'operator', value: '!' },
      { type: 'variable', value: 'P' },
    ];

    const result = parser.parse() as UnaryOperation;

    assert.deepEqual(result, expected);
    assert.equal(result.operation, 'Negation');
  });

  it('should parse P -> Q', () => {
    const expected: Implication = {
      operation: 'Implication',
      left: 'P',
      right: 'Q',
    };

    parser.tokens = [
      { type: 'variable', value: 'P' },
      { type: 'operator', value: '->' },
      { type: 'variable', value: 'Q' },
    ];

    const result = parser.parse() as BinaryOperation;

    assert.deepEqual(result, expected);
    assert.equal(result.operation, 'Implication');
  });

  it('should parse P <-> Q', () => {
    const expected: Biconditional = {
      operation: 'Biconditional',
      left: 'P',
      right: 'Q',
    };

    parser.tokens = [
      { type: 'variable', value: 'P' },
      { type: 'operator', value: '<->' },
      { type: 'variable', value: 'Q' },
    ];

    const result = parser.parse() as BinaryOperation;

    assert.deepEqual(result, expected);
    assert.equal(result.operation, 'Biconditional');
  });

  it('should parse P ∧ Q', () => {
    const expected: Conjunction = {
      operation: 'Conjunction',
      left: 'P',
      right: 'Q',
    };

    parser.tokens = [
      { type: 'variable', value: 'P' },
      { type: 'operator', value: '∧' },
      { type: 'variable', value: 'Q' },
    ];

    const result = parser.parse() as BinaryOperation;

    assert.deepEqual(result, expected);
    assert.equal(result.operation, 'Conjunction');
  });

  it('should parse P & Q', () => {
    const expected: Conjunction = {
      operation: 'Conjunction',
      left: 'P',
      right: 'Q',
    };

    parser.tokens = [
      { type: 'variable', value: 'P' },
      { type: 'operator', value: '&' },
      { type: 'variable', value: 'Q' },
    ];

    const result = parser.parse() as BinaryOperation;

    assert.deepEqual(result, expected);
    assert.equal(result.operation, 'Conjunction');
  });

  it('should parse P | Q', () => {
    const expected: Disjunction = {
      operation: 'Disjunction',
      left: 'P',
      right: 'Q',
    };

    parser.tokens = [
      { type: 'variable', value: 'P' },
      { type: 'operator', value: '|' },
      { type: 'variable', value: 'Q' },
    ];

    const result = parser.parse() as BinaryOperation;

    assert.deepEqual(result, expected);
    assert.equal(result.operation, 'Disjunction');
  });

  it('should parse P v Q', () => {
    const expected: Disjunction = {
      operation: 'Disjunction',
      left: 'P',
      right: 'Q',
    };

    parser.tokens = [
      { type: 'variable', value: 'P' },
      { type: 'operator', value: '∨' },
      { type: 'variable', value: 'Q' },
    ];

    const result = parser.parse() as BinaryOperation;

    assert.deepEqual(result, expected);
    assert.equal(result.operation, 'Disjunction');
  });

  it('should parse (P -> Q) | (Q -> P)', () => {
    const expected: Disjunction = {
      operation: 'Disjunction',
      left: {
        operation: 'Implication',
        left: 'P',
        right: 'Q',
      },
      right: {
        operation: 'Implication',
        left: 'Q',
        right: 'P',
      },
    };

    parser.tokens = [
      { type: 'boundary', value: '(' },
      { type: 'variable', value: 'P' },
      { type: 'operator', value: '->' },
      { type: 'variable', value: 'Q' },
      { type: 'boundary', value: ')' },
      { type: 'operator', value: '|' },
      { type: 'boundary', value: '(' },
      { type: 'variable', value: 'Q' },
      { type: 'operator', value: '->' },
      { type: 'variable', value: 'P' },
      { type: 'boundary', value: ')' },
    ];

    const result = parser.parse() as BinaryOperation;

    assert.deepEqual(result, expected);
    assert.equal(result.operation, 'Disjunction');
  });

  it('should parse (P -> Q) v (Q -> P)', () => {
    const expected: Disjunction = {
      operation: 'Disjunction',
      left: {
        operation: 'Implication',
        left: 'P',
        right: 'Q',
      },
      right: {
        operation: 'Implication',
        left: 'Q',
        right: 'P',
      },
    };

    parser.tokens = [
      { type: 'boundary', value: '(' },
      { type: 'variable', value: 'P' },
      { type: 'operator', value: '->' },
      { type: 'variable', value: 'Q' },
      { type: 'boundary', value: ')' },
      { type: 'operator', value: '∨' },
      { type: 'boundary', value: '(' },
      { type: 'variable', value: 'Q' },
      { type: 'operator', value: '->' },
      { type: 'variable', value: 'P' },
      { type: 'boundary', value: ')' },
    ];

    const result = parser.parse() as BinaryOperation;

    assert.deepEqual(result, expected);
    assert.equal(result.operation, 'Disjunction');
  });

  it('should parse (P | Q) -> (Q & P)', () => {
    const expected: Implication = {
      operation: 'Implication',
      left: {
        operation: 'Disjunction',
        left: 'P',
        right: 'Q',
      },
      right: {
        operation: 'Conjunction',
        left: 'Q',
        right: 'P',
      },
    };

    parser.tokens = [
      { type: 'boundary', value: '(' },
      { type: 'variable', value: 'P' },
      { type: 'operator', value: '|' },
      { type: 'variable', value: 'Q' },
      { type: 'boundary', value: ')' },
      { type: 'operator', value: '->' },
      { type: 'boundary', value: '(' },
      { type: 'variable', value: 'Q' },
      { type: 'operator', value: '&' },
      { type: 'variable', value: 'P' },
      { type: 'boundary', value: ')' },
    ];

    const result = parser.parse() as BinaryOperation;

    assert.deepEqual(result, expected);
    assert.equal(result.operation, 'Implication');
  });

  it('should parse (P v Q) -> (Q ∧ P)', () => {
    const expected: Implication = {
      operation: 'Implication',
      left: {
        operation: 'Disjunction',
        left: 'P',
        right: 'Q',
      },
      right: {
        operation: 'Conjunction',
        left: 'Q',
        right: 'P',
      },
    };

    parser.tokens = [
      { type: 'boundary', value: '(' },
      { type: 'variable', value: 'P' },
      { type: 'operator', value: '∨' },
      { type: 'variable', value: 'Q' },
      { type: 'boundary', value: ')' },
      { type: 'operator', value: '->' },
      { type: 'boundary', value: '(' },
      { type: 'variable', value: 'Q' },
      { type: 'operator', value: '∧' },
      { type: 'variable', value: 'P' },
      { type: 'boundary', value: ')' },
    ];

    const result = parser.parse() as BinaryOperation;

    assert.deepEqual(result, expected);
    assert.equal(result.operation, 'Implication');
  });

  it('should parse !(P | Q)', () => {
    const expected: Negation = {
      operation: 'Negation',
      value: {
        operation: 'Disjunction',
        left: 'P',
        right: 'Q',
      },
    };

    parser.tokens = [
      { type: 'operator', value: '!' },
      { type: 'boundary', value: '(' },
      { type: 'variable', value: 'P' },
      { type: 'operator', value: '|' },
      { type: 'variable', value: 'Q' },
      { type: 'boundary', value: ')' },
    ];

    const result = parser.parse() as UnaryOperation;

    assert.deepEqual(result, expected);
    assert.equal(result.operation, 'Negation');
  });

  it('should parse ¬(P v Q)', () => {
    const expected: Negation = {
      operation: 'Negation',
      value: {
        operation: 'Disjunction',
        left: 'P',
        right: 'Q',
      },
    };

    parser.tokens = [
      { type: 'operator', value: '¬' },
      { type: 'boundary', value: '(' },
      { type: 'variable', value: 'P' },
      { type: 'operator', value: '∨' },
      { type: 'variable', value: 'Q' },
      { type: 'boundary', value: ')' },
    ];

    const result = parser.parse() as UnaryOperation;

    assert.deepEqual(result, expected);
    assert.equal(result.operation, 'Negation');
  });

  it('should not parse (P->)', () => {
    parser.tokens = [
      { type: 'variable', value: 'P' },
      { type: 'operator', value: '->' },
    ];

    assert.throws(() => parser.parse(), Error);
  });

  it('should not parse (P |)', () => {
    parser.tokens = [
      { type: 'variable', value: 'P' },
      { type: 'operator', value: '|' },
    ];

    assert.throws(() => parser.parse(), Error);
  });

  it('should not parse (P &)', () => {
    parser.tokens = [
      { type: 'variable', value: 'P' },
      { type: 'operator', value: '&' },
    ];

    assert.throws(() => parser.parse(), Error);
  });

  it('should not parse (P <->)', () => {
    parser.tokens = [
      { type: 'variable', value: 'P' },
      { type: 'operator', value: '<->' },
    ];

    assert.throws(() => parser.parse(), Error);
  });

  it('should not parse (P ∨)', () => {
    parser.tokens = [
      { type: 'variable', value: 'P' },
      { type: 'operator', value: '∨' },
    ];

    assert.throws(() => parser.parse(), Error);
  });

  it('should not parse (P ∧)', () => {
    parser.tokens = [
      { type: 'variable', value: 'P' },
      { type: 'operator', value: '∧' },
    ];

    assert.throws(() => parser.parse(), Error);
  });

  it('should not parse P->->', () => {
    parser.tokens = [
      { type: 'variable', value: 'P' },
      { type: 'operator', value: '->' },
      { type: 'operator', value: '->' },
    ];

    assert.throws(() => parser.parse(), Error);
  });

  it('should not parse P->|', () => {
    parser.tokens = [
      { type: 'variable', value: 'P' },
      { type: 'operator', value: '->' },
      { type: 'operator', value: '|' },
    ];

    assert.throws(() => parser.parse(), Error);
  });

  it('should not parse P<->Q->', () => {
    parser.tokens = [
      { type: 'variable', value: 'P' },
      { type: 'operator', value: '<->' },
      { type: 'variable', value: 'Q' },
      { type: 'operator', value: '->' },
    ];

    assert.throws(() => parser.parse(), Error);
  });

  it('should not parse (P->)Q', () => {
    parser.tokens = [
      { type: 'boundary', value: '(' },
      { type: 'variable', value: 'P' },
      { type: 'operator', value: '->' },
      { type: 'boundary', value: ')' },
      { type: 'variable', value: 'Q' },
    ];

    assert.throws(() => parser.parse(), Error);
  });

  it('should not parse ((P -> Q)->(QQ))P))', () => {
    parser.tokens = [
      { type: 'boundary', value: '(' },
      { type: 'boundary', value: '(' },
      { type: 'variable', value: 'P' },
      { type: 'operator', value: '->' },
      { type: 'variable', value: 'Q' },
      { type: 'boundary', value: ')' },
      { type: 'operator', value: '->' },
      { type: 'boundary', value: '(' },
      { type: 'variable', value: 'Q' },
      { type: 'variable', value: 'Q' },
      { type: 'boundary', value: ')' },
      { type: 'boundary', value: ')' },
      { type: 'variable', value: 'P' },
      { type: 'boundary', value: ')' },
      { type: 'boundary', value: ')' },
    ];

    assert.throws(() => parser.parse(), Error);
  });
});
