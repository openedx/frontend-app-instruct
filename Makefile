intl_imports = ./node_modules/.bin/intl-imports.js
transifex_utils = ./node_modules/.bin/transifex-utils.js
i18n = ./src/i18n
transifex_input = $(i18n)/transifex_input.json

# This directory must match .babelrc .
transifex_temp = ./temp/babel-plugin-formatjs

precommit:
	npm run lint
	npm audit

requirements:
	npm ci

i18n.extract:
	# Pulling display strings from .jsx files into .json files...
	rm -rf $(transifex_temp)
	npm run-script i18n_extract

i18n.concat:
	# Gathering JSON messages into one file...
	$(transifex_utils) $(transifex_temp) $(transifex_input)

extract_translations: | requirements i18n.extract i18n.concat

# Despite the name, we actually need this target to detect changes in the incoming translated message files as well.
detect_changed_source_translations:
	# Checking for changed translations...
	git diff --exit-code $(i18n)

# Pulls translations using atlas.
pull_translations:
	mkdir src/i18n/messages
	cd src/i18n/messages \
	   && atlas pull $(ATLAS_OPTIONS) \
	            translations/frontend-base/src/i18n/messages:frontend-base \
	            translations/paragon/src/i18n/messages:paragon \
	            translations/frontend-app-instruct/src/i18n/messages:frontend-app-instruct

	$(intl_imports) frontend-base paragon frontend-component-header frontend-component-footer frontend-app-instruct

clean:
	rm -rf dist

build: clean
	tsc --project tsconfig.build.json
	tsc-alias -p tsconfig.build.json
	find src -type f -name '*.scss' -exec sh -c '\
	  for f in "$$@"; do \
	    d="dist/$${f#src/}"; \
	    mkdir -p "$$(dirname "$$d")"; \
	    cp "$$f" "$$d"; \
	  done' sh {} +

validate-no-uncommitted-package-lock-changes:
	# Checking for package-lock.json changes...
	git diff --exit-code package-lock.json

.PHONY: validate
validate:
	make validate-no-uncommitted-package-lock-changes
	npm run i18n_extract
	npm run lint -- --max-warnings 0
	npm run test:ci
	npm run build

.PHONY: validate.ci
validate.ci:
	npm ci
	make validate