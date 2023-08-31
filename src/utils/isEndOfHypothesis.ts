import { ProofEndOfHypothesis, ProofItem } from "src/types/syntactic/proof";

export function isEndOfHypothesis(x: ProofItem): x is ProofEndOfHypothesis {
  return x.type === 'End of Hypothesis';
}
