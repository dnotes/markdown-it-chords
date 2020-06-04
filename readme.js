#!/usr/bin/env node
'use strict'

const fs = require('fs')

const md = require('markdown-it')('commonmark')
md.use(require('.'))

let readme = fs.readFileSync('./README.md', { encoding: 'utf8' }).split('<!--song-->\n')
let song = readme.splice(1,1)[0]
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
	<script src="../dist/markdown-it-chords.min.js"></script>
	<script>
		const md = window.markdownit().use(window.markdownItChords)
		$(function() {
			$('textarea#markdown').keyup(function() {
				var text = $(this).val()
				$('#preview').html(md.render(text))
			})
			$('#preview').html()
		})
	</script>
</head>
<style>
${styles}
body {
	padding:50px;
	font-size:16pt;
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
.clearfix:after {
	content: "";
	display: table;
	clear: both;
}
</style>

<body>

${md.render(readme[0])}

<div id="sandbox" class="clearfix">
	<textarea name="markdown" id="markdown" rows="30">${song}</textarea>
	<div id="preview">${md.render(song)}</div>
</div>

${md.render(readme[1])}

</body>
</html>
`

fs.writeFileSync('./docs/index.html', output)
