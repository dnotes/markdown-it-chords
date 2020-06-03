'use strict'

//                      note half     color                                                               num           extended                                                      bass               diagram
const CHORD_TEST = /^\[[A-G][b#♭♯]*(?:M|Δ|[Mm]aj|m|[Mm]in|-|–|[Dd]im|o|°|ø|[Aa]ug|\+|[Ss]usp?|[Aa]dd)?(?:1?[\d])?(?:(?:[\(\/,]?(?:[-–+Δob#♭♯]|[Mm]aj|[Mm]in|[Ss]usp?)?[0-9]+\)?)*)?(?:\/[A-G][b#♭♯]*)?(?:\|[XxOo\d,\(\)]{3,})?\]/
//                        note   half  color                                                         num         extended                                                 bass           diagram
const CHORD_REGEX = /^\[([A-G])([♭♯]*)(M|Δ|[Mm]aj|m|[Mm]in|‑|[Dd]im|°|ø|[Aa]ug|\+|[Ss]usp?|[Aa]dd)?(1?[\d])?((?:[\(\/,]?(?:[‑+Δ°♭♯]|[Mm]aj|[Mm]in|[Ss]usp?)?[0-9]+\)?)*)?(\/[A-G][♭♯]*)?(\|[XxOo\d,\(\)]{3,})?\]/
const EXTENDED_REGEX = /(?:[\(\/,1]*(?:[‑+Δ°♭♯]|[Mm]aj|[Mm]in|[Ss]usp?)?[02-9]+\)?)*/
const DIAGRAM_REGEX = /^\[(?:[XxOo\d,\(\)]{3,})\]/

const fret = '|'
const str = '&#882;'
const sp = '&nbsp;'
const finger = '&#9679;'

function chords(state, silent) {

	let tail, 
			chordMatch, // the initial match for the entire chord string
			chordSplit, // the chord text split into chord name and diagram
			chord, 			// the grouped match array for the chord name
			diagram, 		// the match for the diagram part of the chord string
			extended, 	// the array of extended color values
			token, 			// placeholder for the token
			// note, half, color, num, extended, bass, diagram,
			pos = state.pos // the position in the state

	if (state.src.charCodeAt(pos) !== 0x5B/* [ */) return false

	tail = state.src.slice(pos)

	if (!tail.length) return false

	chordMatch = tail.match(CHORD_TEST)
	if (chordMatch) {
		chordSplit = chordMatch[0].split('|')
		chord = chordSplit[0].replace(/b/g, '♭').replace(/#/g, '♯').replace(/o/g, '°').replace(/[-–]/g, '‑').match(CHORD_REGEX)
		diagram = chordSplit[1]
	}
	else {
		chordMatch = tail.match(DIAGRAM_REGEX)
		diagram = parseDiagram(chordMatch)
	}

	if (!chord && !diagram) return false

	if (!silent) {
		token = state.push('chord_open', 'span', 1)
		token.attrs = [['class','chord']]
		
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
		if (diagram) {
			token = state.push('chord_i_open', 'i', 1)
			token.attrs = [['class','diagram']]
		
			token = state.push('text', '', 0)
			token.content = diagram
		
			token = state.push('chord_i_close', 'i', -1)
		} // end diagram
	
		token = state.push('chord_inner_close', 'span', -1)
		token = state.push('chord_close', 'span', -1)
	
	}

	state.pos += chordMatch[0].length
	
	return true
}

function parseDiagram(diagram) {
	return false
	if (!diagram) return false
	if (/,/.test(diagram)) {
		diagram = diagram.split(',')
	}
	else {
		diagram = diagram.split()
	}
	return false
}

module.exports = function plugin(md) {
	md.inline.ruler.push('chords', chords)
}
