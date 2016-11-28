export SHELL = /bin/bash

.DEFAULT: help
.PHONY: dist test dev

NODE_PORT:={{=it.NODE_PORT}}
DOCKER_PORT:={{=it.DOCKER_PORT}}
DOCKER_REGISTRY=registry.uw.systems
NAMESPACE={{=it.ns}}
DOCKER_REPOSITORY=$(DOCKER_REGISTRY)/${NAMESPACE}/{{=it.name}}
DOCKER_CONTAINER_NAME={{=it.name}}

help:
	@echo Available targets:
	@echo
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

bypass:
	@echo Nothing to see here...

# BOOTSTRAPPING

install: ## install project node dependencies
	yarn install

# RUNNING

dev: ## run for development
	PORT=$(NODE_PORT) ./node_modules/.bin/nodemon -w src -w index.js --exec node -- index.js  | ./node_modules/.bin/bunyan -o short

# TESTING

test: bypass ## run full test suite

# DOCKER INTEGRATION

docker-image: ## build docker image
	docker build -t $(DOCKER_REPOSITORY) .

docker-push: ## push docker image to repository
	docker push $(DOCKER_REPOSITORY)

docker-run: ## run docker image locally
	docker run -d -p $(DOCKER_PORT):3000 --name $(DOCKER_CONTAINER_NAME) $(DOCKER_REPOSITORY)

# CIRCLE INTEGRATION
ci-docker-auth:
	docker login -e $(DOCKER_EMAIL) -u $(DOCKER_ID) -p $(DOCKER_PASSWORD) $(DOCKER_REGISTRY)

ci-docker-build: ci-docker-auth
	docker build -t $(DOCKER_REPOSITORY):$(CIRCLE_SHA1) .
	docker tag $(DOCKER_REPOSITORY):$(CIRCLE_SHA1) $(DOCKER_REPOSITORY):latest
	docker push $(DOCKER_REPOSITORY)

K8S_URL=https://elb.master.k8s.dev.uw.systems/apis/extensions/v1beta1/namespaces/$(NAMESPACE)/deployments/$(DOCKER_CONTAINER_NAME)
K8S_PAYLOAD={"spec":{"template":{"spec":{"containers":[{"name":"$(DOCKER_CONTAINER_NAME)","image":"$(DOCKER_REPOSITORY):$(CIRCLE_SHA1)"}]}}}}

ci-kubernetes-push:
	test "$(shell curl -o /dev/null -w '%{http_code}' -s -X PATCH -k -d '$(K8S_PAYLOAD)' -H 'Content-Type: application/strategic-merge-patch+json' -H 'Authorization: Bearer $(K8S_DEV_TOKEN)' '$(K8S_URL)')" -eq "200"
