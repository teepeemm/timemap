
SRC_FILES := $(wildcard src/*.js) $(wildcard src/*/*.js)
	
help:
	@echo "Available targets:"
	@echo " help: this message"
	@echo " bin : compiled js files"
	@echo " docs: build documentation"
	@echo " lint: run jslint on source files"
	@echo " build-tests: build Jasmine specs to run unit tests"

.PHONY: help doc lint build-tests

bin: timemap-full.pack.js timemap-pack.js

docs:
	jsdoc --destination docs --recurse src

lint:
	@ : > jslint.txt
	@ $(foreach file,$(SRC_FILES),jslint --browser --white --todo --nomen --edition=latest --terse $(file) 1>> jslint.txt)

build-tests:
	. ./variables.sh ; \
	node create-test-suite.js GMAPS_API=$${GMAPS_API}

timemap-full.pack.js: src/*.js src/ext/*.js src/loaders/*.js
	. ./variables.sh ; \
	java \
	-jar "$${COMPILER_JAR}" \
	--js 'src/timemap.js' \
	--js 'src/param.js' \
	--js 'src/state.js' \
	--js 'src/manipulation.js' \
	--js 'src/ext/*.js' \
	--js 'src/loaders/*.js' \
	--js_output_file timemap-full.pack.js

timemap-pack.js: src/timemap.js
	. ./variables.sh ; \
	java \
	-jar "$${COMPILER_JAR}" \
	--js 'src/timemap.js' \
	--js_output_file timemap.pack.js
