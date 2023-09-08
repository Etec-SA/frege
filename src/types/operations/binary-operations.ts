import { Formula } from '../formulas/formula';

/**
   * Represents a generic binary operation.
   * @interface BinaryOperation
   */
export interface BinaryOperation {
  /**
     * The type of the binary operation.
     */
  operation: string;
  /**
     * The formula on the right side of the binary operation.
     */
  right: Formula;
  /**
     * The formula on the left side of the binary operation.
     */
  left: Formula;
}

/**
   * Represents a binary operation of type Biconditional (<->).
   * @interface Biconditional
   * @extends {BinaryOperation}
   */
export interface Biconditional extends BinaryOperation {
  readonly operation: 'Biconditional';
}

/**
   * Represents a binary operation of type Conjunction (∧).
   * @interface Conjunction
   * @extends {BinaryOperation}
   */
export interface Conjunction extends BinaryOperation {
  readonly operation: 'Conjunction';
}

/**
   * Represents a binary operation of type Disjunction (∨).
   * @interface Disjunction
   * @extends {BinaryOperation}
   */
export interface Disjunction extends BinaryOperation {
  readonly operation: 'Disjunction';
}

/**
   * Represents a binary operation of type Implication (->).
   * @interface Implication
   * @extends {BinaryOperation}
   */
export interface Implication extends BinaryOperation {
  readonly operation: 'Implication';
}
