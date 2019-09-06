.DEFAULT_GOAL:=help
OPEN:=$$(command -v cmd.exe >/dev/null && echo 'cmd.exe /C start ""' || echo 'open')

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

open-alert-tester: ## Open alert tester in browser
	@$(OPEN) http://localhost:30905

open-grafana: ## Open Grafana in browser
	@$(OPEN) http://localhost:30000

open-prometheus: ## Open Prometheus in browser
	@$(OPEN) http://localhost:30900

open-alertmanager: ## Open Prometheus Alertmanager in browser
	@$(OPEN) http://localhost:30903

registry: ## Start local Docker registry on port 5000
	@docker run \
		-d \
		-p 5000:5000 \
		--restart always \
		--name registry \
		registry:2

help: ## Display this help. Thanks to https://suva.sh/posts/well-documented-makefiles/
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n\nTargets:\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)
