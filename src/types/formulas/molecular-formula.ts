import {
  Conjunction,
  Disjunction,
  Implication,
  Biconditional,
} from '../operations/binary-operations';

import { Negation } from '../operations/unary-operation';

export type MolecularFormula =
  | Negation
  | Conjunction
  | Disjunction
  | Implication
  | Biconditional;
