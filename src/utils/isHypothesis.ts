import { ProofItem } from "src/types/syntactic/proof";

export function isHypothesis(x: ProofItem) {
  return x.type === 'Hypothesis';
}
