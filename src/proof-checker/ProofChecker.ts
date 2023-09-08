import { InferenceException } from 'exceptions';
import {
  Proof,
  Formula,
  inferenceRulesMap,
  MappedProof,
  ProofItemInferred,
} from 'types';
import {
  isProofItemInferred,
  parseToFormulaString,
  isHypothesis,
  isEndOfHypothesis,
} from 'utils';

/**
 * Class responsible for checking the syntactic validity of proofs.
 */
export class ProofChecker {
  /**
   * Checks the given proof for validity.
   *
   * @param {Proof} proof - The proof to be checked.
   * @returns {boolean} - `true` if the proof is valid, `InferenceError` or `Error` otherwise.
   */

  static check(proof: Proof) {
    const mappedProof = ProofChecker.createMappedProof(proof);
    let premises: Array<string | Formula> = [];
    let conclusion: string;

    Object.keys(mappedProof).forEach((_, idx) => {
      const item = mappedProof[idx + 1];

      if (isProofItemInferred(item)) {
        const [requiredItens, inferenceRule] = item.from;
        ProofChecker.validateScope(requiredItens, item, mappedProof);

        inferenceRulesMap[inferenceRule](item, proof);
        console.log(
          '\x1b[32m',
          `Applied ${inferenceRule} with success at line ${item.id} ✔️`
        );
      }

      if (item.type === 'Premise') {
        premises.push(item.expression);
      }

      if (item.type === 'Conclusion') {
        conclusion = parseToFormulaString(item.expression as Formula);
      }

      premises = premises.map((formula) => {
        return parseToFormulaString(formula as Formula);
      });
    });

    console.log('\x1b[0m', `\n{ ${premises.join(', ')} } ⊢ ${conclusion}`);
    return true;
  }

  /**
   * Creates a mapped version of the proof, with the representation of the scopes of each item.
   * @param {Proof} proof - The proof to be mapped.
   * @returns {MappedProof} - The mapped proof.
   */

  private static createMappedProof(proof: Proof) {
    let layerIdx = 0;
    let blockIdx = 0;

    Object.keys(proof).forEach((_, idx) => {
      idx++;
      const item = proof[idx];

      if (isHypothesis(item)) {
        blockIdx++;
        layerIdx++;
        proof[idx]['scopeIdx'] = [layerIdx, blockIdx];
      } else if (isEndOfHypothesis(item)) {
        const itemBlockIdx = proof[item.hypothesisId]['scopeIdx'][1];
        proof[idx]['scopeIdx'] = [layerIdx, itemBlockIdx];
        layerIdx--;
      } else {
        proof[idx]['scopeIdx'] = layerIdx === 0 ? [0, 0] : [layerIdx, blockIdx];

        if (layerIdx !== 0 && proof[idx].type === 'Conclusion')
          throw new Error(
            `(Line ${idx}): You cannot put your conclusion inside of a hypothesis.`
          );
      }
    });

    return proof as MappedProof;
  }

  /**
   * Validates the scope of inferred items.
   * @param {number[]} requiredItens - An array of required item IDs.
   * @param {ProofItemInferred} item - The inferred proof item to be validated.
   * @param {MappedProof} mappedProof - The mapped proof.
   */

  private static validateScope(
    requiredItens: number[],
    item: ProofItemInferred,
    mappedProof: MappedProof
  ) {
    requiredItens.forEach((requiredItemId) => {
      const [actualLayer, actualBlock] = mappedProof[item.id].scopeIdx;
      const [requiredLayer, requiredBlock] =
        mappedProof[requiredItemId].scopeIdx;
      const [, inferenceRule] = item.from;
      if (
        actualLayer < requiredLayer &&
        actualBlock != requiredBlock &&
        inferenceRule != 'Conditional Proof'
      )
        throw new InferenceException(
          `Scope Error: cannot access line ${requiredItemId} by the ${item.id} line.`
        );
    });
  }
}
