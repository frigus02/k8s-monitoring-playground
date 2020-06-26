.DEFAULT_GOAL:=help
OPEN:=$$(command -v cmd.exe >/dev/null && echo 'cmd.exe /C start ""' || echo 'open')

deploy-api: ## Deploy API
	@cd api && ./deploy.sh

open-grafana: ## Open Grafana in browser
	@$(OPEN) http://localhost:30000

open-prometheus: ## Open Prometheus in browser
	@$(OPEN) http://localhost:30900

.PHONY: cluster
cluster: ## Start Kubernetes cluster using kind
	@cd cluster && ./init.sh

.PHONY: linkerd
linkerd: ## Deploy Linkerd 2
	linkerd check --pre
	linkerd install | kubectl apply -f -
	linkerd check
	kubectl annotate namespace default linkerd.io/inject=enabled

.PHONY: ingress
ingress: ## Deploys NGINX ingress
	kubectl apply -f ingress/install.yaml
	kubectl wait --namespace ingress-nginx \
		--for=condition=ready pod \
		--selector=app.kubernetes.io/component=controller \
		--timeout=90s

help: ## Display this help. Thanks to https://suva.sh/posts/well-documented-makefiles/
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n\nTargets:\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)
