import { Formula } from "../formulas/formula";
import { RuleApplier } from "src/rulers/RuleApplier";

export const inferenceRules = [
  'Associativity (Biconditional)',
  'Associativity (Conjunction)',
  'Associativity (Disjunction)',
  'Biconditional Elimination',
  'Biconditional Introduction',
  'Commutativity',
  'Conditional Proof',
  'Conditionalization',
  'Contraposition',
  'Conjunction Elimination',
  'Conjunction Introduction',
  'Contraposition',
  'De Morgan',
  'Disjunction Introduction',
  'Disjunctive Syllogism',
  'Distribution (Conjunction over Disjunction)',
  'Distribution (Disjunction over Conjunction)',
  'Double Negation',
  'Double Negation Introduction',
  'Hypothetical Syllogism',
  'Implication Elimination',
  'Implication Negation',
  'Modus Ponens',
  'Modus Tollens',
  'Reductio Ad Absurdum',
] as const;

export type ProofItemType = 'Premisse' | 'Hypothesis' | 'Knowledge' | 'Conclusion' | 'End of Hypothesis';
export type InferenceRule = typeof inferenceRules[number];


export interface ProofItemBase {
  id: number;
  type: ProofItemType;
  expression: string | Formula;
}

export interface ProofItemInferred extends ProofItemBase {
  type: 'Knowledge' | 'Conclusion' | 'End of Hypothesis';
  from: [number[], InferenceRule];
}

export interface ProofEndOfHypothesis extends ProofItemInferred {
  type: 'End of Hypothesis';
  hypothesisId: number;
}

export type ProofItem = ProofItemBase | ProofItemInferred | ProofEndOfHypothesis;

export type Proof = Record<number, ProofItem>;

export const inferenceRulesMap: Record<InferenceRule, (
    proofItem: ProofItem, proof: Proof
  )=> Formula | Formula[]> = {
  "Associativity (Biconditional)": RuleApplier.biconditionalAssociativity,
  "Associativity (Conjunction)": RuleApplier.conjunctionAssociativity,
  "Associativity (Disjunction)": RuleApplier.disjunctionAssociativity,
  "Biconditional Elimination": RuleApplier.biconditionalElimination,
  "Biconditional Introduction": RuleApplier.biconditionalIntroduction,
  "Commutativity": RuleApplier.commutativity,
  "Conditional Proof": RuleApplier.conditionalProof,
  "Conditionalization": RuleApplier.conditionalization,
  "Contraposition": RuleApplier.contraposition,
  "Conjunction Elimination": RuleApplier.conjunctionElimination,
  "Conjunction Introduction": RuleApplier.conjunctionIntroduction,
  "De Morgan": RuleApplier.deMorgan,
  "Disjunction Introduction": RuleApplier.disjunctionIntroduction,
  "Disjunctive Syllogism": RuleApplier.disjunctiveSyllogism,
  "Distribution (Conjunction over Disjunction)":RuleApplier.conjunctionOverDisjunctionDistribution,
  "Distribution (Disjunction over Conjunction)": RuleApplier.disjunctionOverConjunctionDistribution,
  "Double Negation": RuleApplier.doubleNegation,
  "Double Negation Introduction": RuleApplier.doubleNegationIntroduction,
  "Hypothetical Syllogism": RuleApplier.hypotheticalSyllogism,
  "Implication Elimination": RuleApplier.implicationElimination,
  "Implication Negation": RuleApplier.implicationNegation,
  "Modus Ponens": RuleApplier.modusPonens,
  "Modus Tollens": RuleApplier.modusTollens,
  "Reductio Ad Absurdum": RuleApplier.reductioAdAbsurdum,
}

