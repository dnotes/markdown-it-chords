## Chords for lyric sheets, in Markdown

![build](https://travis-ci.org/dnotes/markdown-it-chords.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/dnotes/markdown-it-chords/badge.svg?branch=master)](https://coveralls.io/github/dnotes/markdown-it-chords?branch=master)

[Github]: https://github.com/dnotes/markdown-it-chords
[NPM]: https://npmjs.com/package/markdown-it-chords
[Docs]: https://dnotes.github.io/markdown-it-chords/

This markdown-it plugin makes it easy to add chords to your lyric sheets by simply adding the chords, in brackets, wherever they appear in the context of the lyrics. Chords can be anywhere in a line of text, even in the middle of a word. You can also add chord diagrams that will display like a guitar fretboard.

**The chords will not be rendered properly on [Github] or [NPM].** Please see [the documentation site][docs].

## Installation and Usage

### Node

`npm i markdown-it-chords` or `yarn add markdown-it-chords`

```
var md = require('markdown-it')()
md.use(require('markdown-it-chords'))
md.render('[C]La [F]la [G]la [C]la')
```

see [readme.js](https://github.com/dnotes/markdown-it-chords/blob/master/readme.js)
for an example of usage in NodeJS.

### Browser

1.  Include the file in the document's head, and initialize the markdown-it object:
    ```
    <script src="[cdnjs.com link for markdown-it]"></script>
    <script src="[cdnjs.com link for markdown-it-chords]"></script>
    <script>const md = window.markdown-it('commonmark').use(window.markdownItChords)</script>
    ```

2. Do what you want in the body of the document:

    ```
    $('textarea#markdown').keyup(function() {
        var text = $(this).val()
        $('#preview').html(md.render(text))
    })
    ```

The [documentation site][Docs] has a markdown sandbox which uses this plugin in the browser.

## Example and Syntax

<!--song-->
[C]Do, a deer, a female deer\
[Dm]Ray, a drop of golden sun\
[Eb]May, a possi[D#]bility\
[D/F#]Fee, the price you pay to run

*(half-time, bossanova guitar)*\
[CΔ913]So, — I'd [C6]like to see Bra[Fmaj9]zil . . . . .[F6(9)]\
[E-7b13]La, — I'd [CM7sus2]really like to [E9]go . . .[E7b9]\
[AmΔ7/9]Tea, — I [A-7]sit and sip so [D#ø7]slow . . .[D#o7]\
That will [Dm7|x57565]bring — [F6(9)|x87788]us —— [Em7|x79787]back — [G13|x,10,x,12,12,12]to —— [8xx987]Do . . . .[8,(10),10,9,10,x]
<!--song-->

### Chords

Chords are written inside brackets. The parts of a chord are as follows:

1. The one-letter name of the root note with an optional sharp or flat. The chord root must be capitalized. Sharps and flats can be indicated as the unicode sharp (`♯`) and flat (`♭`) symbols, or by the more common hash (#) and lowercase B (b) symbols.\
[C]`[C]` ,
[F#]`[F#]` ,
[Bb]`[Bb]`

2. (optional) Color and/or number indicators. Recognized color indications include `M`, `Δ`, `maj`, `m`, `min`, `-`, `dim`, `o`, `°`, `ø`, `aug`, `+`, `sus`, and `add`. The first letter of abbreviations may be capitalized.\
[Dmaj]`[Dmaj]` ,
[DMaj7]`[DMaj7]` ,
[DΔ7]`[DΔ7]` ,
[D7]`[D7]` ,
[Dm]`[Dm]` ,
[Dmin]`[Dmin]` ,
[D-7]`[D-7]` ,
[Ddim]`[Ddim]` ,
[Dø]`[Dø]` ,
[Do7]`[Do7]` ,
[DAug]`[DAug]` ,
[D+]`[D+]` ,
[Dsus4]`[Dsus4]` ,
[Dadd9]`[Dadd9]`

3. (optional) Extended color for the chord. Recognized extended chord indications include `-`, `+`, `Δ`, `b`, `#`, `♭`, `♯`, `maj`, `min`, and `sus`. Extensions may be separated from each other by a comma (`,♭9`) or slash (`/♭9`), or may be placed in parentheses (`(♭9)`).\
[CΔ9(13)]`[CΔ9(13)]` ,
[Fmaj9]`[Fmaj9]` ,
[F6,9]`[F6,9]` ,
[E-7/b13]`[E-7/b13]` ,
[CM7sus2]`[CM7sus2]` ,
[E7b9]`[E7b9]` ,
[AmΔ7/9]`[AmΔ7/9]` ,

4. (optional) Bass note for the chord. The bass note is separated from the rest of the chord by a slash (`/`).\
[D/F#]`[D/F#]` ,
[Am7/C]`[Am7/C]`

5. (optional) Chord diagram. The chord diagram is separated from the rest of the chord by a vertical bar (`|`). See below for syntax.

### Diagrams

Chord diagrams are pictures of where the fingers go on the neck of a guitar or other stringed instrument. In markdown, they are written with one place for each string, consiting of one of the following:
* A fret number for a finger placement
* A fret number in parentheses for an optional finger placement
* `0`, `O`, or `o` for an open string
* `X` or `x` for a string that is not played

Diagrams can be attached to a chord ([C|(3)32010]`[C|(3)32010]`) or may stand alone ([(3)32010]`[(3)32010]`). Usually a chord is rendered within a `<span class="chord">` element, but a standalone diagram will have an additional class: `<span class="chord diagram">`. This eases some use cases like having chord diagrams that appear when hovering over a chord name, as is the case with the C chord above.

Chord diagrams for frets beyond the 9th must be written with each fret separated by a comma. Diagrams extending beyond the 4th fret are calculated from a numbered fret.\
[(3)32010]Cmaj (`[(3)32010]`) ,
[x43444]D♭<sup>9</sup> (`[x43444]`) ,
[x54555]D<sup>9</sup> (`[x54555]`) ,
[8,(10),10,9,10,x]C6 (`[8,(10),10,9,10,x]`)

Chord diagrams are, fundamentally, plain text written in Unicode, which means that they can be easily reversed by adding `dir="rtl"` to the proper element, which may be useful for left-handed guitar players.
