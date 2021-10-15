
SRC_FILES := $(wildcard src/*.js) $(wildcard src/*/*.js)
SPEC_FILES := $(wildcard spec/*.js)
	
help:
	@echo "Available targets:"
	@echo " help: this message"
	@echo " bin : compiled js files"
	@echo " docs: build documentation"
	@echo " lint: run jslint on source files"
	@echo " build-tests: build Jasmine specs to run unit tests"

.PHONY: help doc lint build-tests

bin: timemap-full.pack.js

# timemap-pack.js

docs:
	jsdoc --destination docs --recurse src

JSLINT_OPTS = --browser --white --todo --nomen --edition=latest --terse

lint:
	@ : > jslint.txt
	-@ $(foreach file,$(SRC_FILES),jslint $(JSLINT_OPTS) $(file) 1>> jslint.txt)
	-@ $(foreach file,$(SPEC_FILES),jslint $(JSLINT_OPTS) $(file) 1>> jslint.txt)
	-@ jslint $(JSLINT_OPTS) specRunners/specSummary.js 1>> jslint.txt

build-tests:
	. ./variables.sh ; \
		node create-test-suite.js GMAPS_API=$${GMAPS_API}

timemap-full.pack.js: src/*.js src/ext/*.js src/loaders/*.js
	uglifyjs src/timemap.js src/param.js src/state.js src/manipulation.js \
		src/ext/*.js src/loaders/*.js \
		--comments '/^!|@(?:license|preserve)/' \
		-o timemap-full.pack.js

timemap-pack.js: src/timemap.js
	uglifyjs src/timemap.js -o timemap.pack.js
