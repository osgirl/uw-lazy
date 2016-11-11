export SHELL = /bin/bash

.DEFAULT: help
.PHONY: test

INSTALL:=$(shell type -p yarn || echo npm install)

help:
	@echo Available targets:
	@echo
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

bypass:
	@echo 'Bypass'

install: ## install project dependencies (including dev)
	$(INSTALL)

dev: ## run service for development
	NODE_ENV=development PORT=$(NODE_PORT) ./node_modules/.bin/nodemon -w src -w index.js --exec node -- index.js  | ./node_modules/.bin/bunyan -o short

ci-docker-build: bypass ## run docker build in Circle

ci-kubernetes-push: bypass ## push built image form Circle to Kubernetes dev
