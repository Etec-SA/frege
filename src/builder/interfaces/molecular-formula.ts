import { Conjunction } from "./operations/conjunction";
import { Disjunction } from "./operations/disjunction";
import { Implication } from "./operations/implication";
import { Biconditional } from "./operations/biconditional";

export type MolecularFormula = Conjunction | Disjunction | Implication | Biconditional;