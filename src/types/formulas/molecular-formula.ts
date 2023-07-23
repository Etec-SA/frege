import {
  Conjunction,
  Disjunction,
  Implication,
  Biconditional,
} from '../operations/binary-operations';

export type MolecularFormula =
  | Conjunction
  | Disjunction
  | Implication
  | Biconditional;
