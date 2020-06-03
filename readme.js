#!/usr/bin/env node

const fs = require('fs')

const md = require('markdown-it')('commonmark')
md.use(require('.'))

let readmeText = fs.readFileSync('./README.md', {encoding: 'utf8'})
let readme = md.render(readmeText)
let styles = fs.readFileSync('./markdown-it-chords.css', {encoding: 'utf8'})

let output = `
<html>

<style>
body {
	padding:50px;
	font-size:16pt;
}
${styles}
</style>

<body>
</body>

${readme}

</html>
`

fs.writeFileSync('./docs/index.html', output)