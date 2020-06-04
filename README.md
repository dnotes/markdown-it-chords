![build](https://travis-ci.org/dnotes/markdown-it-chords.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/dnotes/markdown-it-chords/badge.svg?branch=master)](https://coveralls.io/github/dnotes/markdown-it-chords?branch=master)

## Chords for lyric sheets, in Markdown

This markdown-it plugin makes it easy to add chords to your lyric sheets by simply adding the chords, in brackets, wherever they appear in the context of the lyrics. Chords can be anywhere in a line of text, even in the middle of a word. You can also add chord diagrams that will display like a guitar fretboard.

## Installation and Usage

`npm i markdown-it-chords` or `yarn add markdown-it-chords`

```
var md = require('markdown-it')()
md.use(require('markdown-it-chords'))
md.render('[C]La [F]la [G]la [C]la')
```

## Example and Syntax


[C]Do, a deer, a female deer\
[Dm]Ray, a drop of golden sun\
[Eb]May, a possi[D#]bility\
[D/F#]Fee, the price you pay to run

*(half-time, bossanova guitar)*\
[CΔ913]So, — I'd [C6]like to see Bra[Fmaj9]zil . . . . .[F6(9)]\
[E-7b13]La, — I'd [CM7sus2]really like to [E9]go . . .[E7b9]\
[AmΔ7/9]Tea, — I [A-7]sit and sip so [D#ø7]slow . . .[D#o7]\
That will [Dm7|x57565]bring — [F6(9)|x87788]us —— [Em7|x79787]back — [G13|x,10,x,12,12,12]to —— [8xx987]Do . . . .[8,(10),10,9,10,x]

