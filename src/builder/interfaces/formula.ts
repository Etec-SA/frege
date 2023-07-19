import { PropositionalVariable } from "./propositional-variable";
import { Negation } from "./operations/negation";
import { Conjunction } from "./operations/conjunction";
import { Disjunction } from "./operations/disjunction";
import { Implication } from "./operations/implication";
import { Biconditional } from "./operations/biconditional";

export type Formula =
  PropositionalVariable |
  Negation |
  Conjunction |
  Disjunction |
  Implication |
  Biconditional;
