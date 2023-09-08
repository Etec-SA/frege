import { Formula } from '../formulas/formula';

/**
   * Represents a generic unary operation.
   * @interface UnaryOperation
   */
export interface UnaryOperation {
  /**
     * The type of the unary operation.
     */
  operation: string;
  /**
     * The formula associated with the unary operation.
     */
  value: Formula;
}

/**
   * Represents a unary operation of type Negation (¬).
   * @interface Negation
   * @extends {UnaryOperation}
   */
export interface Negation extends UnaryOperation {
  readonly operation: 'Negation';
}
