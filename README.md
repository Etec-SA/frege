
# Frege

<div align="center">
<h3 align="center">
<img src="https://raw.githubusercontent.com/Etec-SA/diagrams/main/logos/fregeblu.png">
</h3>
<img src="https://img.shields.io/github/commit-activity/t/Etec-SA/frege?style=for-the-badge"> <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/etec-sa/frege?style=for-the-badge"> <img src="https://img.shields.io/github/last-commit/etec-sa/frege?style=for-the-badge"> <img alt="Repository size" src="https://img.shields.io/github/repo-size/etec-sa/frege?style=for-the-badge"> <img alt="Repository issues" src="https://img.shields.io/github/issues/etec-sa/frege?style=for-the-badge"> <img alt="GitHub" src="https://img.shields.io/github/license/etec-sa/frege?style=for-the-badge">
</div>
<hr>
  
</p>

## 📋 Table of Contents

- [Installation](#-installation)
	- [Requirements](#requirements)
	- [Installing](#installing)
- [Overview](#-overview)
	- [Symbols and Variables](#symbols-and-variables)
	- [Parse](#parse)
		- [Formula string to Object](#formula-string-to-object)
		- [Object to Formula string](#object-to-formula-string)
	- [Evaluate](#evaluate)
	- [Reduce](#reduce)
	- [Truth Tables](#generate-truth-table)
		- [Print Truth Table](#print-truth-table)
	- [Formula Properties](#formula-properties)
		- [isTautology](#istautology)
		- [isContingency](#iscontingency)
		- [isContradiction](#iscontradiction) 
	- [Check Proof](#check-proof)
	- [Semantic Consequence](#semantic-consequence)
- [Technologies](#-technologies)
  - [Requirements](#requirements)
  - [Installing and configuring the project](#installing-and-configuring-the-project)
 - [But why "Frege"?](#but-why-frege)
- [How to contribute](#-how-to-contribute)
- [License](#-license)

## 💻 Installation

### Requirements

- [Node.js](https://nodejs.org/en/)
- [Yarn](https://classic.yarnpkg.com/), [NPM](https://www.npmjs.com/) or similar.

### Installing
```bash
$ npm -i fregejs
```
## 👀 Overview

**"Frege"** is a lib created by the <a href="https://github.com/etec-sa/" target="_blank">Boolestation Team</a> in order to assist in tasks involving propositional logic.

Constructing formulas, simplifying them, checking semantic or syntactic validity are responsibilities that Frege proposes to resolve.


### Symbols and Variables

When passing propositional logic formulas to some Frege function, it is necessary to know that the accepted symbols are the following:
```typescript
export type Operator = '¬' | '∧' | '∨' | '->' | '<->' | '!' | '&' | '|';
```
Parentheses ( "()" ) are also accepted.

When entering any propositional variable, only **uppercase** `A - Z` letters will be accepted.

```typescript
// Supported ✅
frege.evaluate('¬(P ∧ Q)', {P: false, Q: true});

// Not supported ❌
frege.evaluate('~(p ^ Q)', {p: false, Q: true});
```






### Parse

Frege allows the developer to work with object formulas or with string formulas. It is possible to carry out the conversion process mutually. Strings can be parsed to objects and objects can be parsed to strings.

#### Formula string to Object:
```typescript
import { frege } from 'fregejs';

frege.parse.toFormulaObject('P -> Q'); // {1} Implication
frege.parse.toFormulaObject('P <-> Q'); // {2} Biconditional
frege.parse.toFormulaObject('P ∧ Q'); // {3} Conjunction
frege.parse.toFormulaObject('P ∨ Q'); // {4} Disjunction
frege.parse.toFormulaObject('¬P'); // {5} Negation

/*
Alternative Symbols:
*/
frege.parse.toFormulaObject('P & Q'); // {6} Conjunction
frege.parse.toFormulaObject('P | Q'); // {7} Disjunction
frege.parse.toFormulaObject('!P'); // {8} Negation
```
**output**:
```typescript
{ operation: 'Implication', left: 'P', right: 'Q' } // {1} Implication
{ operation: 'Biconditional', left: 'P', right: 'Q' } // {2} Biconditional
{ operation: 'Conjunction', left: 'P', right: 'Q' }   // {3} Conjunction
{ operation: 'Disjunction', left: 'P', right: 'Q' }   // {4} Disjunction
{ operation: 'Negation', value: 'P' } // {5} Negation

/*
Alternative Symbols:
*/
{ operation: 'Conjunction', left: 'P', right: 'Q' }   // {6} Conjunction
{ operation: 'Disjunction', left: 'P', right: 'Q' }   // {7} Disjunction
{ operation: 'Negation', value: 'P' } // {8} Negation
```

#### Object to Formula string:
```typescript
frege.parse.toFormulaString({ operation:  'Implication', left:  'P', right:  'Q' }); // {1} Implication
frege.parse.toFormulaString({ operation:  'Biconditional', left:  'P', right:  'Q' }); // {2} Biconditional
frege.parse.toFormulaString({ operation:  'Conjunction', left:  'P', right:  'Q' }); // {3} Conjunction
frege.parse.toFormulaString({ operation:  'Disjunction', left:  'P', right:  'Q' }); // {4} Disjunction
frege.parse.toFormulaString({ operation:  'Negation', value:  'P' }); // {5} Negation
```
**output:**
```
(P -> Q) // {1}
(P <-> Q) // {2}
(P ∧ Q)  // {3}
(P ∨ Q)  // {4}
¬(P)    // {5}
```

### Evaluate
The "evaluate" function calculates the truth value of a molecular formula according to the truth value of its atomic formulas.
```typescript
import { frege } from 'fregejs';

const first = frege.evaluate('P->(Q->P)', { P:  false, Q:  true }); // {1}

const second = frege.evaluate(
	{
		operation:  'Conjunction',
		left:  'P',
		right: { operation:  'Negation', value:  'P' }
	},
	{ P:  true }
); // {2}

const third = frege.evaluate('¬¬P ∨ ¬P', { P:  true }); // {3}

console.log('first:', first)
console.log('second:', second);
console.log('third:', third);
```
**output:**
```typescript
first: true
second: false
third: true  
```
### Reduce
The "reduce" function reduces any logical formula that uses implications or biconditionals to a logical formula that uses only the operators of: conjunction, negation and disjunction.
```typescript
import { frege } from  'fregejs';
frege.reduce('( P -> Q ) ∨ (A ∧ B)'); // {1}
frege.reduce('P <-> ( Q -> P )'); // {2}
```
**output:**
```
((¬(P) ∨ Q) ∨ (A ∧ B)) // {1}
((¬(P) ∨ (¬(Q) ∨ P)) ∧ (¬((¬(Q) ∨ P)) ∨ P)) // {2}
```

### Generate Truth Table:
The "generateTruthTable" function generates a truth table for the formula passed in the parameter. The returned value will be an object, which contains a **header**, with the propositional variables and the formula in question; the **truth-value combinations** for propositional variables; the **truth values of the formula** according to each combination.

```typescript
import { frege } from  'fregejs';

frege.generateTruthTable('P->(Q->P)'); // {1}
frege.generateTruthTable({operation:  'Conjunction', left:  'P', right:  'Q'}); // {2}
```
**output:**
```typescript
// {1}
{
	headers: [ 'P', 'Q', 'P->(Q->P)' ],
	truthCombinations: [ [ false, false ], [ false, true ], [ true, false ], [ true, true ] ],
	truthValues: [ true, true, true, true ]
}

// {2}
{
	headers: [ 'P', 'Q', '(P ∧ Q)' ],
	truthCombinations: [ [ false, false ], [ false, true ], [ true, false ], [ true, true ] ],
	truthValues: [ false, false, false, true ]
}
```
#### Print Truth Table
```typescript
import { printTruthTable, frege } from 'fregejs';

const truthTable = frege.generateTruthTable('P->Q');
printTruthTable(truthTable);
```
**output:**
```bash
P       Q       P->Q
F       F       T
F       T       T
T       F       F
T       T       T
```

### Formula Properties
We can also check some properties of a formula using the "isContingency", "isTautology" or "isContradiction" functions.

#### isTautology
```typescript
const formula = 'P->(Q->P)';
const isTautology = frege.isTautology(formula);
console.log(`Is "${formula}" a tautology? ${isTautology}`); // Output: Is "P->(Q->P)" a tautology? true
```

#### isContingency

```typescript
const formula = 'P <-> Q';
const isContingency = frege.isContingency(formula);
console.log(`Is "${formula}" a contingency? ${isContingency}`); // Output: Is "P <-> Q" a contingency? true
```

#### isContradiction
```typescript
const formula = 'P ∧ ¬P';
const isContradiction = frege.isContradiction(formula);
console.log(`Is "${formula}" a contradiction? ${isContradiction}`); // Output: Is "P ∧ ¬P" a contradiction? true
```
### Check Proof:
The "checkproof" function evaluates the validity of the logical test passed in the parameter. If it is valid, it displays the application of the rules in the `console` and returns `true`. Otherwise, it throws an `InferenceException`, explaining the reason for its **invalidity**.

```typescript
import { frege, Proof } from  'fregejs';
const { toFormulaObject } = frege.parse;

const  proof: Proof = {
	1: {
		id:  1,
		expression:  toFormulaObject('¬P ∧ ¬Q'),
		type:  'Premise'
	},
	2: {
		id:  2,
		expression:  toFormulaObject('(P ∨ Q)'),
		type:  'Hypothesis'
	},
	
	3: {
		id:  3,
		expression:  toFormulaObject('¬P'),
		from: [[1], 'Conjunction Elimination'],
		type:  'Knowledge'
	},
	4: {
		id:  4,
		expression:  toFormulaObject('¬Q'),
		from: [[1], 'Conjunction Elimination'],
		type:  'Knowledge'
	},
	5: {
		id:  5,
		expression:  toFormulaObject('P'),
		from: [[2, 4], 'Disjunctive Syllogism'],
		type:  'Knowledge'
	},
	6: {
		id:  6,
		expression:  toFormulaObject('P ∧ ¬P'),
		type:  'End of Hypothesis',
		hypothesisId:  2,
		from: [[5, 3], 'Conjunction Introduction']
	},
	7: {
		id:  7,
		expression:  toFormulaObject('(P ∨ Q) -> (P ∧ ¬P)'),
		type:  'Knowledge',
		from: [[2,6], 'Conditional Proof']
	},
	8: {
		id:  8,
		expression:  toFormulaObject('¬(P ∨ Q)'),
		type:  'Conclusion',
		from: [[7], 'Reductio Ad Absurdum']
	}
}

frege.checkProof(proof); // {1}
```
**output:**
```
 Applied Conjunction Elimination with success at line 3 ✔️
 Applied Conjunction Elimination with success at line 4 ✔️ 
 Applied Disjunctive Syllogism with success at line 5 ✔️   
 Applied Conjunction Introduction with success at line 6 ✔️
 Applied Conditional Proof with success at line 7 ✔️       
 Applied Reductio Ad Absurdum with success at line 8 ✔️    
 
 { (¬(P) ∧ ¬(Q)) } ⊢ ¬((P ∨ Q))
```
**Fallacy of affirming the consequent:**
```typescript
const proof: Proof = {
  1: {
    id: 1,
    expression: toFormulaObject('P -> Q'),
    type: 'Premise'
  },
  2: {
    id: 2,
    expression: toFormulaObject('Q'),
    type: 'Premise'
  },
  3: {
    id: 3,
    expression: toFormulaObject('P'),
    type: 'Conclusion',
    from: [[1, 2], 'Modus Ponens']
  },
}

frege.checkProof(proof); // {2}
```

**output:**
```
InferenceException [Error]: Modus Ponens: cannot apply in (P -> Q) with Q
```

### Semantic consequence:
The function "verifyConsequence.semantic" identifies if there is a case where, in a truth table, all **premises are true,** but the **conclusion is false**.

If so, it returns `false`. Else, returns `true`.
```typescript
import { frege } from  'fregejs';

const first = frege.verifyConsequence.semantic(['P->Q', 'Q'], 'P'); // {1}
const second = frege.verifyConsequence.semantic(['P->Q', 'P'], 'Q'); // {2}

console.log('first: ', first);
console.log('second: ', second);
```
**output:**
```
first:  false
second:  true
```

## 🚀 Technologies

The main technologies used are:

- [Node.js](https://nodejs.org/en/)
- [TypeScript](https://www.typescriptlang.org/)
- [llang](https://github.com/pnevyk/llang)

## But why Frege?
> "**Friedrich Ludwig Gottlob Frege** ([/ˈfreɪɡə/](https://en.wikipedia.org/wiki/Help:IPA/English 'Help:IPA/English');[[15]](https://en.wikipedia.org/wiki/Gottlob_Frege#cite_note-15) German: [[ˈɡɔtloːp ˈfreːɡə]](https://en.wikipedia.org/wiki/Help:IPA/Standard_German "Help:IPA/Standard German"); 8 November 1848 – 26 July 1925) was a German [philosopher](https://en.wikipedia.org/wiki/Philosopher 'Philosopher'), [logician](https://en.wikipedia.org/wiki/Mathematical_logic 'Mathematical logic'), and [mathematician](https://en.wikipedia.org/wiki/Mathematician 'Mathematician'). He was a mathematics professor at the [University of Jena](https://en.wikipedia.org/wiki/University_of_Jena 'University of Jena'), and is understood by many to be the father of [analytic philosophy](https://en.wikipedia.org/wiki/Analytic_philosophy 'Analytic philosophy'), concentrating on the [philosophy of language](https://en.wikipedia.org/wiki/Philosophy_of_language 'Philosophy of language'), [logic](https://en.wikipedia.org/wiki/Philosophy_of_logic 'Philosophy of logic'), and [mathematics](https://en.wikipedia.org/wiki/Philosophy_of_mathematics 'Philosophy of mathematics')." via <a href="https://en.wikipedia.org/wiki/Gottlob_Frege" target="_blank">Wikipedia.</a>

## 🤔 How to contribute

Thanks for taking an interest in contributing. New features, bug fixes, better performance and better typing are extremely welcome.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
