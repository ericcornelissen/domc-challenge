.PHONY: all clean

SRC  := $(wildcard src/*)
DIST := $(patsubst src/%,dist/%,$(SRC))

all: $(DIST) dist/highlight

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

dist/highlight: | node_modules dist
	@cp -r node_modules/@tanstack/highlight/dist dist/highlight
	@find dist/highlight -name '*.ts' -delete

node_modules: package-lock.json
	@npm clean-install
