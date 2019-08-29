.DEFAULT_GOAL:=help

deploy-alert-tester: ## Deploy alert tester
	@cd alert-tester && ./deploy.sh

deploy-api: ## Deploy API
	@cd api && ./deploy.sh

deploy-fluentd: ## Deploy Fluentd
	@cd fluentd && ./deploy.sh

deploy-grafana: ## Deploy Grafana
	@cd grafana && ./deploy.sh

deploy-prometheus: ## Deploy Prometheus
	@cd prometheus && ./deploy.sh

registry: ## Start local Docker registry on port 5000
	@docker run \
    	-d \
    	-p 5000:5000 \
    	--restart always \
    	--name registry \
    	registry:2

help: ## Display this help. Thanks to https://suva.sh/posts/well-documented-makefiles/
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n\nTargets:\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)
