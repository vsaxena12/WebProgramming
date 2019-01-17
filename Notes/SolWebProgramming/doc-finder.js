const {inspect} = require('util'); //for debugging

'use strict';

class DocFinder {

  /** Constructor for instance of DocFinder. */
  constructor() {

    //set of all noise words added so far
    this.noiseWords = new Set(); 

    //map from document name to its content
    this.contents = new Map();
    
    //map from word to documents map.  Each documents map for a word
    //consists of a map from the document name to a pair, where
    //pair[0] gives the number of occurrences of the word in the document
    //and pair[1] gives the offset of the first occurrence of the word
    //in the document.
    this.indexes = new Map();

    //map of completions
    this.completions = new Map();
    this.isComplete = false;

  }

  /** Return array of non-noise normalized words from string content.
   *  Non-noise means it is not a word in the noiseWords which have
   *  been added to this object.  Normalized means that words are
   *  lower-cased, have been stemmed and all non-alphabetic characters
   *  matching regex [^a-z] have been removed.
   */
  words(content) {
    return this._wordsLow(content).map((pair) => pair[0]);
  }

  /** Add all normalized words in noiseWords string to this as
   *  noise words. 
   */
  addNoiseWords(noiseWords) {
    this.words(noiseWords).forEach((w) => this.noiseWords.add(w));
  }

  /** Add document named by string name with specified content to this
   *  instance. Update index in this with all non-noise normalized
   *  words in content string.
   */ 
  addContent(name, content) {
    if (!content.endsWith('\n')) content += '\n';
    this.contents.set(name, content);
    this._wordsLow(content).forEach((pair) => {
      const [word, offset] = pair;
      let wordIndex = this.indexes.get(word);
      if (!wordIndex) this.indexes.set(word, wordIndex = new Map());
      let wordInfo = wordIndex.get(name);
      if (!wordInfo) wordIndex.set(name, wordInfo = [0, offset]);
      wordInfo[0]++;
    });
    this.isComplete = false;
  }

  /** Given a list of normalized, non-noise words search terms, 
   *  return a list of Result's  which specify the matching documents.  
   *  Each Result object contains the following properties:
   *     name:  the name of the document.
   *     score: the total number of occurrences of the search terms in the
   *            document.
   *     lines: A string consisting the lines containing the earliest
   *            occurrence of the search terms within the document.  Note
   *            that if a line contains multiple search terms, then it will
   *            occur only once in lines.
   *  The Result's list must be sorted in non-ascending order by score.
   *  Results which have the same score are sorted by the document name
   *  in lexicographical ascending order.
   *
   */
  find(terms) {
    const docs = this._findDocs(terms);
    const results = [];
    for (const [name, wordInfos] of docs.entries()) {
      const contents = this.contents.get(name);
      const score =
	wordInfos.reduce((acc, wordInfo) => acc + wordInfo[0], 0);
      const offsets = wordInfos.map(wordInfo => wordInfo[1]);
      results.push(new OffsetResult(name, score, offsets).result(contents));
    }
    results.sort(compareResults);
    return results;
  }

  /** Given a text string, return a ordered list of all completions of
   *  the last word in text.  Returns [] if the last char in text is
   *  not alphabetic.
   */
  complete(text) {
    if (!this.isComplete) this._makeCompletions();
    if (!text.match(/[a-zA-Z]$/)) return [];
    const word = text.split(/\s+/).map(w=>normalize(w)).slice(-1)[0];
    return this.completions.get(word[0]).filter((w) => w.startsWith(word));
  }

  /** Add each word in this.indexes starting with character c to list
   *  this.completions[c].
   */
  _makeCompletions() {
    const completions = new Map();
    for (const word of this.indexes.keys()) {
      const c = word[0];
      if (!completions.get(c)) completions.set(c, []);
      completions.get(c).push(word);
    }
    for (const [c, words] of completions) { words.sort(); }
    this.completions = completions;
    this.isComplete = true;
  }

  /** Like words(), except that it returns a list of pairs with
   *  pair[0] containing the word and pair[1] containing the
   *  offset within content where the word starts.
   */
  _wordsLow(content) {
    const words = [];
    let match;
    while (match = WORD_REGEX.exec(content)) {
      const word = normalize(match[0]);
      if (word && !this.noiseWords.has(word)) {
	words.push([word, match.index]);
      }
    }
    return words;
  }

  /** Give a list of non-noise normalized terms, return a map from
   *  document name to a list of pairs where pair[0] contains a count
   *  of the number of occurences of a term from terms and pair[1]
   *  contains the offset at which the term occurs in the document
   *  content.
   */
  _findDocs(terms) {
    const docs = new Map();
    terms.forEach((term) => {
      const termIndex = this.indexes.get(term);
      if (termIndex) {
	for (const [name, idx] of termIndex.entries()) {
	  let docIndex = docs.get(name);
	  if (!docIndex) docs.set(name, docIndex = []);
	  docIndex.push(idx);
	}
      }
    });
    return docs;
  }
  
} //class DocFinder

module.exports = DocFinder;

/** Regex used for extracting words as maximal non-space sequences. */
const WORD_REGEX = /\S+/g;

/** A simple class which packages together the result for a 
 *  document search as documented above in DocFinder.find().
 */ 
class Result {
  constructor(name, score, lines) {
    this.name = name; this.score = score; this.lines = lines;
  }

  toString() { return `${this.name}: ${this.score}\n${this.lines}`; }
}

/** Compare result1 with result2: higher scores compare lower; if
 *  scores are equal, then lexicographically earlier names compare
 *  lower.
 */
function compareResults(result1, result2) {
  return (result2.score - result1.score) ||
    result1.name.localeCompare(result2.name);
}

/** Normalize word by stem'ing it, removing all non-alphabetic
 *  characters and converting to lowercase.
 */
function normalize(word) {
  return stem(word.toLowerCase()).replace(/[^a-z]/g, '');
}

/** Place-holder for stemming a word before normalization; this
 *  implementation merely removes 's suffixes.
 */
function stem(word) {
  return word.replace(/\'s$/, '');
}

/** Like Result, except that instead of lines it contains a list of
 *  offsets at which the search terms occur within the document.
 */
class OffsetResult {
  constructor(name, score, offsets) {
    this.name = name; this.score = score; this.offsets = offsets;
  }

  /** Convert this to a Result by using this.offsets to extract
   *  lines from contents.
   */ 
  result(contents) {
    const starts = new Set();
    this.offsets.forEach(o => starts.add(contents.lastIndexOf('\n', o) + 1));
    let lines = '';
    for (const i of Array.from(starts).sort((a, b) => a-b)) {
      lines += contents.substring(i, contents.indexOf('\n', i) + 1);
    }
    return new Result(this.name, this.score, lines);
  }
}

