.PHONY: all clean

SRC  := $(wildcard src/*)
DIST := $(patsubst src/%,dist/%,$(SRC))

all: $(DIST)

clean:
	@git clean -fx \
		dist/ \
		node_modules/

serve: all
	@cd dist/ && python3 -m http.server 8080

# ---------------------------------------------------------------------------- #

dist:
	@mkdir dist/

dist/%.css: src/%.css | dist
	@echo 'Moving $<'
	@cp '$<' '$@'

dist/%.html: src/%.html | dist
	@echo 'Moving $<'
	@cp '$<' '$@'

dist/%.js: src/%.js | node_modules dist
	@npx javascript-obfuscator '$<' --output '$@' | grep -v '^$$'

node_modules: package-lock.json
	@npm clean-install
