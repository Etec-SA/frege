import { ProofItem, ProofItemInferred } from 'types/syntactic/proof';

export function isProofItemInferred(x: ProofItem): x is ProofItemInferred {
  if (!x?.type) return false;

  return ['Knowledge', 'End of Hypothesis', 'Conclusion'].includes(x.type);
}
