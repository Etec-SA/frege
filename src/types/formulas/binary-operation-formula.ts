import {
  Conjunction,
  Disjunction,
  Implication,
  Biconditional,
} from '../operations/binary-operations';

export type BinaryOperationFormula =
  | Conjunction
  | Disjunction
  | Implication
  | Biconditional;
