import { PropositionalVariable } from "../operations/propositional-variable";

export type TruthValue = 0 | 1 | true | false;

/**
   * Represents a mapping of propositional variables to their truth values.
   */
export type PropositionalVariableValues = {
    [K in PropositionalVariable]?: boolean;
};

 /**
   * Represents a truth table containing headers, truth combinations, and truth values.
   * 
   * @example
   * ```
   *  [
   *    ['P', 'Q', '(P -> Q)'], //headers
   *    [
   *      [0, 0], [0, 1], //combinations for P and Q
   *      [1, 0], [1, 1]
   *    ],
   *    [true, true, false, true] // truth values for each combination
   * ]
   * ```
   */
export type TruthTable = [string[], TruthValue[][], boolean[]];