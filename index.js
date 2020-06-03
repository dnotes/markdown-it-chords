'use strict'

//                      note half     color                                                               num           extended                                                      bass               diagram
const CHORD_TEST = /^\[[A-G][b#♭♯]*(?:M|Δ|[Mm]aj|m|[Mm]in|-|–|[Dd]im|o|°|ø|[Aa]ug|\+|[Ss]usp?|[Aa]dd)?(?:1?[\d])?(?:(?:[\(\/,]?(?:[-–+Δob#♭♯]|[Mm]aj|[Mm]in|[Ss]usp?)?[0-9]+\)?)*)?(?:\/[A-G][b#♭♯]*)?(?:\|[XxOo\d,\(\)]{3,})?\]/
//                        note   half  color                                                         num         extended                                                 bass           diagram
const CHORD_REGEX = /^\[([A-G])([♭♯]*)(M|Δ|[Mm]aj|m|[Mm]in|‑|[Dd]im|°|ø|[Aa]ug|\+|[Ss]usp?|[Aa]dd)?(1?[\d])?((?:[\(\/,]?(?:[‑+Δ°♭♯]|[Mm]aj|[Mm]in|[Ss]usp?)?[0-9]+\)?)*)?(\/[A-G][♭♯]*)?(\|[XxOo\d,\(\)]{3,})?\]/
const EXTENDED_REGEX = /(?:[\(\/,1]*(?:[‑+Δ°♭♯]|[Mm]aj|[Mm]in|[Ss]usp?)?[02-9]+\)?)*/
const DIAGRAM_REGEX = /^\[(?:[XxOo\d,\(\)]{3,})\]/

function chords(state, silent) {

	let tail, 
			chordMatch, 	// the initial match for the entire chord string
			chordSplit, 	// the chord text split into chord name and diagram
			chord, 				// the grouped match array for the chord name
			diagram, 			// the match for the diagram part of the chord string
			extended, 		// the array of extended color values
			token, 				// placeholder for the token
			classes,			// the classes for the chord
			pos = state.pos // the position in the state

	if (state.src.charCodeAt(pos) !== 0x5B/* [ */) return false

	tail = state.src.slice(pos)

	if (!tail.length) return false

	chordMatch = tail.match(CHORD_TEST)
	if (chordMatch) {
		chordSplit = chordMatch[0].split('|')
		chord = (chordSplit[0] + ']').replace(/b/g, '♭').replace(/#/g, '♯').replace(/o/g, '°').replace(/[-–]/g, '‑').match(CHORD_REGEX)
		diagram = parseDiagram(chordSplit[1])
	}
	else {
		chordMatch = (tail.match(DIAGRAM_REGEX) || [''])
		diagram = parseDiagram(chordMatch[0])
	}

	if (!chord && !diagram) return false
	classes = chord ? 'chord' : 'chord diagram'

	if (!silent) {
		token = state.push('chord_open', 'span', 1)
		token.attrs = [['class',classes]]
		
		token = state.push('chord_inner_open', 'span', 1)
		token.attrs = [['class','inner']]
	
		// chord
		if (chord) {
			extended = chord[5] ? chord[5].match(EXTENDED_REGEX) : false
			token = state.push('chord_i_open', 'i', 1)
			token.attrs = [['class','name']]
		
			token = state.push('text', '', 0)

			// note
			token.content = chord[1]

			// half
			if (chord[2]) token.content += chord[2]

			// color
			if (chord[3] === 'ø') { // handle half diminished, as the unicode character is not widely available
				state.push('sup_open', 'sup', 1)
				token = state.push('text', '', 0)
				token.content = 'ø'
				state.push('sup_close', 'sup', -1)
			}
			else if (chord[3]) { // for all other color
				token.content += chord[3]
			}

			// num
			if (chord[4]) {
				state.push('sup_open', 'sup', 1)
				token = state.push('text', '', 0)
				token.content = chord[4]
				state.push('sup_close', 'sup', -1)
			}

			// extended
			if (extended) extended.forEach(v => {
				state.push('sup_open', 'sup', 1)
				token = state.push('text', '', 0)
				token.content = v
				state.push('sup_close', 'sup', -1)
			})

			// bass
			if (chord[6]) {
				token = state.push('text', '', 0)
				token.content = chord[6]
			}
				
			token = state.push('chord_i_close', 'i', -1)
		} // end chord
	
		// diagram
		if (diagram && diagram.length) {
			token = state.push('chord_i_open', 'i', 1)
			token.attrs = [['class','diagram']]
		
			// render each line and then a <br> tag
			diagram.forEach(line => {
				token = state.push('text', '', 0)
				token.content = line
				state.push('br', 'br', 0)
			})
		
			token = state.push('chord_i_close', 'i', -1)
		} // end diagram
	
		token = state.push('chord_inner_close', 'span', -1)
		token = state.push('chord_close', 'span', -1)
	
	}

	state.pos += chordMatch[0].length
	
	return true
}

function parseDiagram(diagram) {
	if (!diagram) return false

	const fr = '|',																// pipe
				str = String.fromCharCode(0x0336),			// combining long stroke overlay
				sp = String.fromCharCode(0xa0),					// non-breaking space
				finger = String.fromCharCode(0x25cf),		// black circle
				optional = String.fromCharCode(0x25cb)	// white circle
		
	let min = 99, // minimum used fret
			max = 0,	// maximum used fret
			fret, 		// fret number on which to place character
			frets,		// whether to show the frets for a line (first and last lines should not)
			char, 		// character to place on fret
			nut='',		// the beginning of a line
			line,			// a single line
			lines=[] // the rendered lines

	

	// Remove wrappers and separators
	diagram = diagram.replace(/[\[\]|]/g,'').replace(/[Oo]/g, '0')

	// Split diagram (commas are used for frets beyond 9)
	diagram = /,/.test(diagram) ? diagram.split(',') : diagram.match(/\(?[XxOo\d]\)?/g)

	// Reverse the diagram
	diagram.reverse()

	// Gather raw numbers and get minimum fret
	diagram = diagram.map(v => {

		// get the fret number
		fret = parseInt(v.replace(/[\(\)]/g,''))

		// check for min and max
		if (fret && fret < min) min = fret
		if (fret && fret > max) max = fret
		
		// get the proper character
		if (isNaN(fret)) char = 'x'
		else if (!fret) char = sp
		else if (/\(/.test(v)) char = optional
		else char = finger

		// return the full data
		return {
			fret: fret || 0,
			char: char
		}
	})

	// don't capo if a chord is within the first four frets
	if (max <= 4) min = 0
	// make sure there are at least three frets
	if (max - min < 2) max++

	// render fret number and strings, if needed
	if (min) {
		lines.push(`${sp}${min}`)
		nut = str
	}

	// render each position of the diagram
	diagram.forEach((o,idx) => {
		frets = idx && (idx < (diagram.length -1))
		// initial space or x
		line = o.char === 'x' ? 'x' : sp
		// first fret of line
		line += `${frets ? fr : sp}${nut}`
		for (let i=min; i<=max; i++) {
			// character in position
			line += i === o.fret ? o.char : sp
			// string and fret after
			line += `${str}${frets ? fr : sp}${str}`
		}
		lines.push(`${line}`)
	})

	return lines
}

module.exports = function plugin(md) {
	md.inline.ruler.push('chords', chords)
}
