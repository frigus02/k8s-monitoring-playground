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
   $ kubectl apply -f config/
   ```

1. Deploy Grafana:

   ```console
   $ cd grafana/
   $ ./deploy.sh
   ```
