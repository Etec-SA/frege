import { ProofEndOfHypothesis, ProofItem } from 'types/syntactic/proof';

export function isEndOfHypothesis(x: ProofItem): x is ProofEndOfHypothesis {
  return x.type === 'End of Hypothesis';
}
