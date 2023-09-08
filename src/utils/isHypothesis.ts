import { ProofItem } from 'types/syntactic/proof';

export function isHypothesis(x: ProofItem) {
  return x.type === 'Hypothesis';
}
