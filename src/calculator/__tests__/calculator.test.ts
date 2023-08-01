import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Calculator } from '../Calculator';
import {
  Biconditional,
  Conjunction,
  Disjunction,
  Implication,
} from 'src/types/operations/binary-operations';
import { Negation } from 'src/types/operations/unary-operation';

describe('Calculator', () => {
  it('should be defined', () => {
    assert.ok(Calculator, 'Calculator Class is defined.');
  });

  describe('evaluate', () => {
    it('should be defined', () => {
      assert.ok(Calculator.evaluate, 'evaluate method is defined');
    });

    it('should evaluate correctly an implication', () => {
      const operation: Implication = {
        operation: 'Implication',
        left: 'A',
        right: 'B',
      };
      const case1 = Calculator.evaluate(operation, { A: true, B: true });
      const case2 = Calculator.evaluate(operation, { A: false, B: true });
      const case3 = Calculator.evaluate(operation, { A: true, B: false });
      const case4 = Calculator.evaluate(operation, { A: false, B: false });

      assert.equal(case1, true);
      assert.equal(case2, true);
      assert.equal(case3, false);
      assert.equal(case4, true);
    });

    it('should evaluate correctly a conjunction', () => {
      const operation: Conjunction = {
        operation: 'Conjunction',
        left: 'A',
        right: 'B',
      };
      const case1 = Calculator.evaluate(operation, { A: true, B: true });
      const case2 = Calculator.evaluate(operation, { A: false, B: true });
      const case3 = Calculator.evaluate(operation, { A: true, B: false });
      const case4 = Calculator.evaluate(operation, { A: false, B: false });

      assert.equal(case1, true);
      assert.equal(case2, false);
      assert.equal(case3, false);
      assert.equal(case4, false);
    });

    it('should evaluate correctly a disjunction', () => {
      const operation: Disjunction = {
        operation: 'Disjunction',
        left: 'A',
        right: 'B',
      };
      const case1 = Calculator.evaluate(operation, { A: true, B: true });
      const case2 = Calculator.evaluate(operation, { A: false, B: true });
      const case3 = Calculator.evaluate(operation, { A: true, B: false });
      const case4 = Calculator.evaluate(operation, { A: false, B: false });

      assert.equal(case1, true);
      assert.equal(case2, true);
      assert.equal(case3, true);
      assert.equal(case4, false);
    });

    it('should evaluate correctly a biconditional', () => {
      const operation: Biconditional = {
        operation: 'Biconditional',
        left: 'A',
        right: 'B',
      };
      const case1 = Calculator.evaluate(operation, { A: true, B: true });
      const case2 = Calculator.evaluate(operation, { A: false, B: true });
      const case3 = Calculator.evaluate(operation, { A: true, B: false });
      const case4 = Calculator.evaluate(operation, { A: false, B: false });

      assert.equal(case1, true);
      assert.equal(case2, false);
      assert.equal(case3, false);
      assert.equal(case4, true);
    });

    it('should evaluate correctly a negation', () => {
      const operation: Negation = { operation: 'Negation', value: 'A' };
      const case1 = Calculator.evaluate(operation, { A: true });
      const case2 = Calculator.evaluate(operation, { A: false });

      assert.equal(case1, false);
      assert.equal(case2, true);
    });

    it('should evaluate A->(B->A)', ()=>{
        const operation = 'A->(B->A)';
        const case1 = Calculator.evaluate(operation, { A: true, B: true });
        const case2 = Calculator.evaluate(operation, { A: false, B: true });
        const case3 = Calculator.evaluate(operation, { A: true, B: false });
        const case4 = Calculator.evaluate(operation, { A: false, B: false });

        assert.equal(case1, true);
        assert.equal(case2, true);
        assert.equal(case3, true);
        assert.equal(case4, true);
    });

    it('should evaluate ¬(¬(A ∧ ¬B) ∧ ¬(A ∧ ¬B))', ()=>{
      const operation = '¬A ∨ (¬B ∨ A)';
      const case1 = Calculator.evaluate(operation, { A: true, B: true });
      const case2 = Calculator.evaluate(operation, { A: false, B: true });
      const case3 = Calculator.evaluate(operation, { A: true, B: false });
      const case4 = Calculator.evaluate(operation, { A: false, B: false });

      assert.equal(case1, true);
      assert.equal(case2, true);
      assert.equal(case3, true);
      assert.equal(case4, true);
    })

    it('should evaluate ¬(¬ A ∧ ¬(B->A))', ()=>{
      const operation = '¬(A ∧ ¬¬(B ∧ ¬A))';

      const case1 = Calculator.evaluate(operation, { A: true, B: true });
      const case2 = Calculator.evaluate(operation, { A: false, B: true });
      const case3 = Calculator.evaluate(operation, { A: true, B: false });
      const case4 = Calculator.evaluate(operation, { A: false, B: false });

      assert.equal(case1, true);
      assert.equal(case2, true);
      assert.equal(case3, true);
      assert.equal(case4, true);
    });
  });
});