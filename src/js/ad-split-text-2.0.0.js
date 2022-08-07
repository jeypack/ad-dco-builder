/**
 * A D - S P L I T T E X T
 * Version  : 2.0.0
 * Author   : J. Pfeifer  @egplusww.com
*/
(function ($) {

    'use strict';

	var p, pC, pW, pL,
        egp = window.EGPlus,
		ad = (egp.ad && typeof egp.ad === 'object') ? egp.ad : {},
        doc = document;

    function Char(target, content) {
        this.init('char', target, content, null);
    }
    //pC = Char.prototype = [];
    pC = Char.prototype;

    pC.init = function (type, target, content, children) {
        this.type = type;
        this.target = target;
        this.children = children;
        if (type === 'line' || type === 'word' || type === 'char') { this.styles = []; }
        if (type !== 'root') { this.content = content || ''; }
        if (type !== 'line' && type !== 'word' && type !== 'char') { this.lines = []; }
        if (type !== 'word' && type !== 'char') { this.words = []; }
        if (type !== 'char') { this.chars = []; }
    };

    pC.inline = function (options) {
        if (options.position && options.position !== '') {
            this.styles.push('position: ' + options.position + ';');
            this.styles.push('display: inline-block;');
        }
    };

    function Word(target, content) {
        this.init('word', target, content, []);
    }
    pW = Word.prototype = Object.create(pC);

    pW.add = function (item) {
        this.children.push(item);
        return this;
    };

    // creating child elements into dom
    pW.html = function (child, className, text) {
        var nodeType = "div",
            elem = doc.createElement(nodeType);
        if (child.styles.length) {
            elem.style.cssText = child.styles.join(' ');
        }
        // set class name of element
        if (className && className !== '') { elem.className = className; }
        // set text content to inner html
        if (text && text !== "") {
            elem.innerHTML = text;
        }
        // set target reference
        child.target = elem;
        // append to current element - this creates new child element
        this.target.appendChild(elem);
        return elem;
    };

    function Line(target, content) {
        this.init('line', target, content, []);
    }

    pL = Line.prototype = Object.create(pW);

    function SplitText(type, target, content) {
        this.init(type, target, content, []);
    }

    p = SplitText.prototype = Object.create(pL);

    p.revert = function () {
        //console.log("+");
        //console.log("+ splitText revert ", "this:", this);
        var c, d, t, line, word, char, i = this.children.length;
        this.lines.splice(0);
        this.words.splice(0);
        this.chars.splice(0);
        if (this.type === 'root') {
            while (--i > -1) {
                this.children[i].revert();
            }
        } else {
            // we are inside block
            while (--i > -1) {
                line = this.children[i];
                line.words = [];
                line.chars = [];
                //console.log("+ splitText revert ", "i:", i, "line:", line);
                c = line.children.length;
                // lines
                while (--c > -1) {
                    word = line.children[c];
                    word.chars = [];
                    d = word.children.length;
                    //console.log("+ splitText revert ", "c:", c, "word:", word);
                    while (--d > -1) {
                        char = word.children[d];
                        //console.log("+ splitText revert ", "c:", c, "d:", d, "char:", char);
                        char.target = null;
                        char = null;
                    }
                    word = word.children = word.target = null;
                }
                line = line.children = line.target = null;
            }
            t = this.target;
            c = t.childNodes.length;
            while (--c > -1) {
                t.removeChild(t.childNodes[c]);
            }
            t.innerHTML = this.content;
            //this.children = this.target = null;
            //this.children = this.target = null;
        }
    };

    ///p.getTargets = function ()

    /**
     * Splits the text of the given dom element into lines, words or chars
     * @param   {object} elems   DomElement or selector string
     * @param   {object} options optional Options like the type 'lines,words,chars'
     * @returns {object} The returned object contains information like the raw text...and revert method
     * @example ad.splitText('div.wrapper-banner div.typo', { type: 'lines,words,chars', lineClass: 'line', wordClass: 'word', charClass: 'char', linePaddingLeft: [], lineHeight: [], wordSize: [], position: 'relative' })
     * @example ad.splitText('div.wrapper-banner div.typo', {
         type: 'lines,words,chars',
         lineClass: 'line',
         wordClass: 'word',
         charClass: 'char',
         linePaddingLeft: [],
         lineHeight: [],
         wordSize: [],
         position: 'relative'
     })
     */
    ad.splitText = function (elems, options) {
        //console.log("+++");
        var i, l, opts, hasLines, hasWords, hasChars, text, block, elem,
            // +++ THE COMPOSITE ROOT +++
            compositeObj = new SplitText('root', (elems && elems.find) ? elems : $(elems)),
            // +++ FACTORY FUNCTION +++
            createCompositeSplit = function (elem, text) {
                // var re = /<br>/gi;  txt = text.replace(re, "<BR>");
                var i, c, d, l, li, lc, ld, words, chars, line, word, char, span,
                    lines = text.split('<br>'),
                    // create composition
                    block = new SplitText('block', elem, text);
                // clean up element and loop over lines
                elem.innerHTML = '';
                // get max lines
                li = lines.length;
                for (i = 0; i < li; i++) {
                    line = new Line(block.target, lines[i]);
                    if (hasLines) {
                        line.inline(opts);
                        if (opts.linePaddingLeft.length > 0) {
                            line.styles.push('padding-left: ' + (opts.linePaddingLeft[compositeObj.lines.length] || opts.linePaddingLeft[opts.linePaddingLeft.length - 1]) + 'px;');
                        }
                        if (opts.lineHeight.length > 0) {
                            line.styles.push('line-height: ' + (opts.lineHeight[compositeObj.lines.length] || opts.lineHeight[opts.lineHeight.length - 1]) + 'px;');
                        }
                        block.html(line, opts.lineClass, (hasWords || hasChars) ? '' : line.content);
                        // push to lines (root and block)
                        block.lines.push(line.target);
                        compositeObj.lines.push(line.target);
                    } else if (i > 0) {
                        line.target.appendChild(document.createElement("br"));
                    }
                    block.add(line);
                    //console.log("++++ createCompositeSplit ", "line:", line);
                    //console.log("++++ createCompositeSplit ", "line.target:", line.target);

                    words = lines[i].split(' ');
                    lc = words.length;
                    for (c = 0; c < lc; c++) {
                        //console.log("++++ createCompositeSplit ", "words.length:", lc, "words[c]:", words[c], "words[c] === '':", (words[c] === ''));
                        // only create word if line has text/content //if (words[c] !== '') {
                        word = new Word(line.target, words[c]);
                        // stop rendering empty word because of <br> (words[c] !== '')
                        if (hasWords && words[c] !== '') {
                            word.inline(opts);
                            if (opts.wordSize.length > 0) {
                                word.styles.push('font-size: ' + (opts.wordSize[compositeObj.words.length] || opts.wordSize[opts.wordSize.length - 1]) + 'px;');
                            }
                            line.html(word, opts.wordClass, hasChars ? '' : word.content);
                            // push to words (root and block and line)
                            line.words.push(word.target);
                            block.words.push(word.target);
                            compositeObj.words.push(word.target);

                        }
                        // create blank sign textnode after each word except the last word
                        if (hasWords && c !== lc - 1) {
                            //console.log("++++ createCompositeSplit ", "appendChild blank text node:", c);
                            line.target.appendChild(doc.createTextNode(" "));
                        }
                        line.add(word);
                        //console.log("++++ createCompositeSplit ", "word:", word);
                        //console.log("++++ createCompositeSplit ", "word.target:", word.target);
                        chars = words[c].split('');
                        ld = chars.length;
                        for (d = 0; d < ld; d++) {
                            char = new Char(word.target, chars[d]);
                            if (hasChars) {
                                char.inline(opts);
                                word.html(char, opts.charClass, char.content);
                                // push to chars (root and block and line and word)
                                word.chars.push(char.target);
                                line.chars.push(char.target);
                                block.chars.push(char.target);
                                compositeObj.chars.push(char.target);
                                if (!hasWords && i > 0 && c !== lc - 1 && d === ld - 1) {
                                    //console.log("++++ createCompositeSplit ", "appendChild blank span node:", "i:", i, "c:", c, "d:", d);
                                    span = document.createElement("span");
                                    span.appendChild(doc.createTextNode(" "));
                                    line.target.appendChild(span);
                                }
                            }
                            word.add(char);

                        }
                    }
                }
                //console.log("++++ createCompositeSplit ", "block:", block);
                return block;
            };
        // extend default options
        opts = egp.extend({ type: 'lines,words,chars', lineClass: 'line', wordClass: 'word', charClass: 'char', linePaddingLeft: [], lineHeight: [], wordSize: [], position: '' }, options);
        //take short references to options type
        hasLines = (opts.type.indexOf('lines') !== -1);
        hasWords = (opts.type.indexOf('words') !== -1);
        hasChars = (opts.type.indexOf('chars') !== -1);
        /*console.log("+ splitText ", "hasLines:", hasLines);
        console.log("+ splitText ", "hasWords:", hasWords);
        console.log("+ splitText ", "hasChars:", hasChars);
        console.log("+ splitText ", "compositeObj:", compositeObj);
        console.log("+ splitText ", "opts:", JSON.stringify(opts));*/
        // add compositeObj members
        // doing this for all elements
        l = compositeObj.target.length;
        for (i = 0; i < l; i++) {
            elem = compositeObj.target[i];
            // take inner html
            text = elem.innerHTML;
            // create composite pattern
            block = createCompositeSplit(elem, text);
            compositeObj.add(block);
        }

        return compositeObj;
    };

}(window.EGPlus.$));
