import assert from 'assert/strict';
import { describe, it } from 'node:test';
import { builder } from '../Builder';
import { Formula } from '../interfaces/formula';
import { Implication } from '../interfaces/operations/implication';

describe('Builder', () => {
  it('should be defined', () => {
    assert.ok(builder);
  });

  it('should build a conjunction', () => {
    const result = builder.buildFormula({
      operation: 'Conjunction',
      left: 'P',
      right: 'Q',
    });

    const expected = '(P ∧ Q)';
    assert.equal(result, expected);
  });

  it('should build a disjunction', () => {
    const result = builder.buildFormula({
      operation: 'Disjunction',
      left: 'P',
      right: 'Q',
    });

    const expected = '(P ∨ Q)';
    assert.equal(result, expected);
  });

  it('should build an implication', () => {
    const result = builder.buildFormula({
      operation: 'Implication',
      left: 'P',
      right: 'Q',
    });

    const expected = '(P -> Q)';
    assert.equal(result, expected);
  });

  it('should build a biconditional', () => {
    const result = builder.buildFormula({
      operation: 'Biconditional',
      left: 'P',
      right: 'Q',
    });

    const expected = '(P ↔ Q)';
    assert.equal(result, expected);
  });

  it('should build a negation', () => {
    const result = builder.buildFormula({
      operation: 'Negation',
      value: 'A',
    });

    const expected = '¬(A)';
    assert.equal(result, expected);
  });

  it('should build (P->(Q->P))', () => {
    const right: Formula = {
      operation: 'Implication',
      left: 'Q',
      right: 'P',
    };

    const result = builder.buildFormula({
      operation: 'Implication',
      left: 'P',
      right,
    });

    assert.equal(result, '(P -> (Q -> P))');
  });

  it('should build ¬((P ^ (Q->Q)) -> (A<->¬(A)))', () => {
    const leftImplication: Implication = {
      operation: 'Implication',
      left: 'Q',
      right: 'Q',
    };

    const left: Formula = {
      operation: 'Negation',
      value: {
        operation: 'Conjunction',
        left: 'P',
        right: leftImplication,
      },
    };

    const right: Formula = {
      operation: 'Biconditional',
      left: 'A',
      right: {
        operation: 'Negation',
        value: 'A',
      },
    };

    const result = builder.buildFormula({
      operation: 'Implication',
      left,
      right,
    });

    assert.equal(result, '(¬((P ∧ (Q -> Q))) -> (A ↔ ¬(A)))');
  });
});
