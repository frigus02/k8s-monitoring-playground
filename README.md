# Kubernetes monitoring playground

> A place to play with monitoring solutions for applications running in a Kubernetes cluster

This contains demo configurations for one application ([api](./api)) and tools to capture logs, generate metrics and show dashboards (Fluentd, Prometheus and Grafana).

- The API

  - is instrumented and provides Prometheus metrics on http://0.0.0.0:24231/metrics
  - logs data in JSON

- Fluentd grabs the logs and generates the same metrics for Prometheus, exposed on http://0.0.0.0:24231/metrics

- Prometheus aggregates and stores all metrics

- Grafana queries Prometheus to produce dashboards

## Usage

1. Install [`kyml`](https://github.com/frigus02/kyml):

   ```console
   curl -sfL -o /usr/local/bin/kyml https://github.com/frigus02/kyml/releases/download/v20190103/kyml_20190103_darwin_amd64 && chmod +x /usr/local/bin/kyml
   ```

   It's used in the deploy scripts to apply Kubernetes manifests.

1. Start local Docker registry:

   ```console
   $ make registry
   ```

1. Start local Kubernetes server (tested with Docker for Mac)

1. Deploy Alert tester:

   ```console
   $ make deploy-alert-tester
   ```

   You can now access the alert tester under http://localhost:30905

1. Deploy API:

   ```console
   $ make deploy-api
   ```

1. Deploy Fluentd:

   ```console
   $ make deploy-fluentd
   ```

1. Deploy Prometheus:

   ```console
   $ make deploy-prometheus
   ```

   You can now access Prometheus under http://localhost:30900 and the alert manager under http://localhost:30903

1. Deploy Grafana:

   ```console
   $ make deploy-grafana
   ```

   You can now access Grafana under http://localhost:30000

   There should be a Dashboard called "Main" with a few panels.

## Alternatives?

- Elastic stack: https://www.elastic.co/elasticsearch-kubernetes
- Datadog: https://www.datadoghq.com/product/
