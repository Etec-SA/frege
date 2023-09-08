import { frege } from 'index';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { Biconditional, Conjunction } from 'types';

describe('frege.reduce', () => {
  it('should be defined', () => {
    assert.ok(frege.reduce);
  });

  it('should reduce a formula object', () => {
    const formulaObject: Biconditional = {
      operation: 'Biconditional',
      left: 'P',
      right: 'Q',
    };

    const expectedReducedFormula: Conjunction = {
      operation: 'Conjunction',
      left: {
        operation: 'Disjunction',
        left: { operation: 'Negation', value: 'P' },
        right: 'Q',
      },
      right: {
        operation: 'Disjunction',
        left: { operation: 'Negation', value: 'Q' },
        right: 'P',
      },
    };

    const reducedFormula = frege.reduce(formulaObject);
    assert.deepStrictEqual(reducedFormula, expectedReducedFormula);
  });

  it('should reduce a formula string', () => {
    const formulaString = 'P<->Q';
    const expectedReducedFormula = '((¬(P) ∨ Q) ∧ (¬(Q) ∨ P))';
    const reducedFormula = frege.reduce(formulaString);

    assert.equal(reducedFormula, expectedReducedFormula);
  });
});
