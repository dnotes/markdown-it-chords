#!/usr/bin/env node
'use strict'

const fs = require('fs')

const md = require('markdown-it')('commonmark')
md.use(require('.'))

let readme = fs.readFileSync('./README.md', { encoding: 'utf8' }).split('<!--song-->\n')
let song = readme.splice(1, 1)[0]
let styles = fs.readFileSync('./markdown-it-chords.css', { encoding: 'utf8' })

let output = `<html>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>markdown-it-chords: Write your lyric sheets in markdown</title>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/markdown-it/11.0.0/markdown-it.min.js" integrity="sha256-3mv+NUxFuBg26MtcnuN2X37WUxuGunWCCiG2YCSBjNc=" crossorigin="anonymous"></script>
	<script src="markdown-it-chords.min.js"></script>
	<script>
		const md = window.markdownit().use(window.markdownItChords)
		$(function() {
			$('textarea#markdown').keyup(function() {
				$('#preview').html(md.render($(this).val()))
			})
			$('#handed').change(function() {
				$('.chord i.diagram').attr('dir', $(this).val())
			})
			$('#chord-diagram-font-size').on('input', function() {
				$(':root').css('--chord-diagram-font-size', $(this).val() + 'px')
			})
			$('#song-font-size').on('input', function() {
				$('#preview').css('font-size', $(this).val() + 'pt')
			})
		})
	</script>
</head>
<style>
${styles}
.chord {
	font-family: Didot, "Helvetica Neue", serif;
}
body {
	padding: 50px;
	font-size: 14pt;
	max-width: 1900px;
	margin: 0 auto;
}
#sandbox div,
#sandbox textarea {
	width: 50%;
	resize: none;
	overflow: scroll;
	float: left;
	box-sizing: border-box;
	padding: 10px;
}
code {
	background: #eee;
	font-size: 75%;
}
pre {
	background: #eee;
	padding: 10px 10px 0;
	max-width: 100%;
	overflow: scroll;
	display: inline-block;
}
.clearfix:after, pre:after {
	content: "";
	display: table;
	clear: both;
}
#controls {
	background: lightgray;
	padding: 10px;
}
#controls select,
#controls input {
	vertical-align: middle;
}
</style>

<body>

${md.render(readme[0])}

<div id="controls">
	<label for="handed">Playing hand:</label>
	<select name="handed" id="handed">
		<option value="ltr" selected="selected">right-handed</option>
		<option value="rtl">left-handed</option>
	</select>
	<label for="song-font-size">Song font size:</label>
	<input type="range" min="10" max="24" value="16" class="slider" name="song-font-size" id="song-font-size">
	<label for="chord-diagram-font-size">Diagram size:</label>
	<input type="range" min="5" max="24" value="10" class="slider" name="chord-diagram-font-size" id="chord-diagram-font-size">
</div>
<div id="sandbox" class="clearfix">
	<textarea name="markdown" id="markdown" rows="30">${song}</textarea>
	<div id="preview">${md.render(song)}</div>
</div>

${md.render(readme[1])}

</body>
</html>
`

fs.writeFileSync('./docs/index.html', output)
