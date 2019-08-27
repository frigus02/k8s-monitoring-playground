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
   $ ./registry.sh
   ```

1. Start local Kubernetes server (tested with Docker for Mac)

1. Deploy API:

   ```console
   $ cd api/
   $ ./deploy.sh
   ```

1. Deploy Fluentd:

   ```console
   $ cd fluentd/
   $ ./deploy.sh
   ```

1. Deploy Prometheus:

   ```console
   $ cd prometheus/
   $ ./deploy.sh
   ```

   Wait for the Prometheus Operator pod to be up and running. Then apply the Prometheus configuration:

   ```console
   $ kubectl apply -f config/
   ```

   You can now access Prometheus under http://localhost:30900

1. Deploy Grafana:

   ```console
   $ cd grafana/
   $ ./deploy.sh
   ```

   You can now access Grafana under http://localhost:30000

   There should be a Dashboard called "Main" with a few panels.
