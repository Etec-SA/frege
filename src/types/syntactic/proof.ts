import { Formula } from "../formulas/formula";
import { RuleApplier } from "rulers/RuleApplier";

/**
   * List of available inference rules.
   */
export const INFERENCE_RULES = [
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

/**
   * Represents the types of items in a proof.
   */
export type ProofItemType = 'Premise' | 'Hypothesis' | 'Knowledge' | 'Conclusion' | 'End of Hypothesis';
export type InferenceRule = typeof INFERENCE_RULES[number];

/**
   * Represents the base structure of a proof item.
   */
export interface ProofItemBase {
  /**
     * The unique identifier of the proof item.
     */
  id: number;
  /**
     * The type of the proof item.
     */
  type: ProofItemType;
  /**
     * The logical expression associated with the proof item.
     */
  expression: string | Formula;
}

/**
   * Represents an inferred proof item.
   */
export interface ProofItemInferred extends ProofItemBase {
  type: 'Knowledge' | 'Conclusion' | 'End of Hypothesis';
  
  /**
     * The source of the inference, including the line numbers and the inference rule applied.
     * @example
    * // This indicates that the proof item is inferred from lines 1 and 2 using the 'Conjunction Introduction' rule.
     * from: [[1, 2], 'Conjunction Introduction']
     */
  from: [number[], InferenceRule];
}

/**
   * Represents the end of a hypothesis in a proof.
   */
export interface ProofEndOfHypothesis extends ProofItemInferred {
  type: 'End of Hypothesis';
  hypothesisId: number;
}

export type ProofItem = ProofItemBase | ProofItemInferred | ProofEndOfHypothesis;

/**
   * Represents a proof as a mapping of item IDs to proof items.
   * @example
   * const proof: Proof = {
   *   1: {
   *     id: 1,
   *     type: 'Premisse',
   *     expression: 'P',
   *   },
   *   2: {
   *     id: 2,
   *     type: 'Premisse',
   *     expression: 'P -> Q',
   *   },
   *   3: {
   *     id: 3,
   *     expression: 'Q',
   *     type: 'Conclusion',
   *     from: [[1, 2], 'Modus Ponens'],
   *   },
   * };
   */
export type Proof = Record<number, ProofItem>;

/**
   * Represents a mapped proof as a mapping of item IDs to proof items with scope information.
   */
export type MappedProof = Record<number, ProofItem & {scopeIdx: number[]}>

/**
   * A mapping of inference rules to functions that apply the rules to proof items.
   */
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

