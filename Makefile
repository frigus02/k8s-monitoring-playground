.DEFAULT_GOAL:=help

.PHONY: all
all: cluster linkerd ingress-traefik jaeger otel-collector api ## Install everything

.PHONY: api
api: ## Deploy API
	@cd api && ./deploy.sh

.PHONY: cluster
cluster: ## Start Kubernetes cluster using kind
	@cd cluster && ./init.sh

.PHONY: linkerd
linkerd: ## Deploy Linkerd 2
	linkerd check || {\
		linkerd check --pre;\
		linkerd install | kubectl apply -f -;\
		linkerd check;\
		kubectl annotate namespace default linkerd.io/inject=enabled;\
		kubectl annotate namespace default config.linkerd.io/trace-collector=otel-collector.otel-collector:55678;\
		kubectl annotate namespace default config.alpha.linkerd.io/trace-collector-service-account=default;\
	}

.PHONY: ingress-traefik
ingress-traefik: ## Deploy Traefik ingress
	kubectl apply -f ingress-traefik/install.yaml
	kubectl rollout status -n ingress-traefik deployment ingress-traefik

.PHONY: ingress-nginx
ingress-nginx: ## Deploy NGINX ingress
	kubectl apply -f ingress-nginx/install.yaml
	kubectl wait --namespace ingress-nginx \
		--for=condition=ready pod \
		--selector=app.kubernetes.io/component=controller \
		--timeout=90s

.PHONY: jaeger
jaeger: ## Deploy Jaeger All in One
	kubectl apply -k jaeger

.PHONY: otel-collector
otel-collector: ## Deploy OpenTelemetry Collector
	kubectl apply -k otel-collector -n otel-collector
	kubectl rollout status -n otel-collector deployment otel-collector

.PHONY: metrics-server
metrics-server: ## Deploy Metrics Server
	kubectl apply -f metrics-server/0.3.6.yaml

.PHONY: help
help: ## Display this help. Thanks to https://suva.sh/posts/well-documented-makefiles/
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n\nTargets:\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)
