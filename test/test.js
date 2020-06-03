'use strict'

var path     = require('path')
var generate = require('markdown-it-testgen')

/*eslint-env mocha*/

describe('Tests for markdown-it plugin', function () {
  var md = require('markdown-it')().use(require('../'))
  generate(path.join(__dirname, 'fixtures/definitions.txt'), { header: true }, md)
})
