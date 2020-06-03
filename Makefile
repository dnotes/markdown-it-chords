PATH        := ./node_modules/.bin:${PATH}

NPM_PACKAGE := $(shell node -e 'process.stdout.write(require("./package.json").name)')
NPM_VERSION := $(shell node -e 'process.stdout.write(require("./package.json").version)')
NPM_CAMEL   := $(shell node -e "process.stdout.write('${NPM_PACKAGE}'.replace(/-([a-z])/g, t => t[1].toUpperCase() ))")

TMP_PATH    := /tmp/${NPM_PACKAGE}-$(shell date +%s)

REMOTE_NAME ?= origin
REMOTE_REPO ?= $(shell git config --get remote.${REMOTE_NAME}.url)
REPO_STR    := $(shell echo ${REMOTE_REPO} | tr "/:@" " ")
GIT_ACCT    := $(word 3, ${REPO_STR})
GIT_HOST    := $(word 2, ${REPO_STR})

CURR_HEAD   := $(firstword $(shell git show-ref --hash HEAD | cut -b -6) master)
GIT_PROJ    := https://${GIT_HOST}/${GIT_ACCT}/${NPM_PACKAGE}

config:
	echo "package:	${NPM_PACKAGE}"
	echo "root obj:	${NPM_CAMEL}"
	echo "version:	${NPM_VERSION}"
	echo "tmp path:	${TMP_PATH}"
	echo "remote name:	${REMOTE_NAME}"
	echo "git repo:	${REMOTE_REPO}"
	echo "git host:	${GIT_HOST}"
	echo "git acct:	${GIT_ACCT}"
	echo "git head:	${CURR_HEAD}"
	echo "project:	${GIT_PROJ}"

build:
	@rm -rf ./dist
	@mkdir dist
	# Browserify
	@( printf "/*! ${NPM_PACKAGE} ${NPM_VERSION} ${GITHUB_PROJ} @license MIT */" ; \
		browserify ./ -s ${NPM_CAMEL} \
		) > dist/${NPM_PACKAGE}.js
	# Minify
	@terser dist/${NPM_PACKAGE}.js -b beautify=false,ascii_only=true -c -m \
		--preamble "/*! ${NPM_PACKAGE} ${NPM_VERSION} ${GITHUB_PROJ} @license MIT */" \
		> dist/${NPM_PACKAGE}.min.js

publish:
	@if test 0 -ne `git status --porcelain | wc -l` ; then \
		echo "Unclean working tree. Commit or stash changes first." >&2 ; \
		exit 128 ; \
		fi
	@if test 0 -ne `git fetch ; git status | grep '^# Your branch' | wc -l` ; then \
		echo "Local/Remote history differs. Please push/pull changes." >&2 ; \
		exit 128 ; \
		fi
	@if test 0 -ne `git tag -l ${NPM_VERSION} | wc -l` ; then \
		echo "Tag ${NPM_VERSION} exists. Update package.json" >&2 ; \
		exit 128 ; \
		fi
	git tag ${NPM_VERSION} && git push ${REMOTE_NAME} ${NPM_VERSION}

.PHONY: publish browserify config
.SILENT: config