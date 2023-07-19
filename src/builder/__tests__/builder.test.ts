import assert from "assert/strict";
import { describe, it } from "node:test";
import { Builder } from "../Builder";

describe('Builder', () => {
  it('should be defined', () => {
    assert.ok(Builder);
  });

  it('should build an disjunction', () => {
    const disjunction = Builder.disjunction;
    assert.equal(disjunction('p', 'q'), 'P ∨ Q');
    assert.equal(disjunction('(p ∨ q)', 'q'), '(P ∨ Q) ∨ Q');
    assert.equal(
      disjunction('((p -> q) -> (q -> (p -> q)))', '(q <-> p)'),
      '((P -> Q) -> (Q -> (P -> Q))) ∨ (Q <-> P)'
    );
  });
})
