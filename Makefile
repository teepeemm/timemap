
help:
	@echo "Available targets:"
	@echo "help: this message"
	@echo "bin : compiled js files"

.PHONY: help

bin: timemap-full-pack.js timemap-pack.js

timemap-full-pack.js: src/*.js src/ext/*.js src/loaders/*.js
	. ./variables.sh
	java \
	-jar "${COMPILER_JAR}" \
	--js 'src/*.js' \
	--js 'src/ext/*.js' \
	--js 'src/loaders/*.js' \
	--js_output_file timemap-full-pack.js


timemap-pack.js: src/timemap.js
	. ./variables.sh
	java \
	-jar "${COMPILER_JAR}" \
	--js 'src/timemap.js' \
	--js_output_file timemap-pack.js
