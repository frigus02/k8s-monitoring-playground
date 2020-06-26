# Kubernetes monitoring playground

> A place to play with monitoring solutions for applications running in a Kubernetes cluster

This contains demo configurations for one application ([api](./api)) and tools to capture traces, generate metrics and show dashboards (Linkerd, OpenTelemetry, Jaeger, Prometheus and Grafana).

- The API is instrumented and sends OpenTelemetry traces and metrics to an OpenTelemetry agent.

- NGINX Ingress is instrumented and sends OpenTelemetry traces to the OpenTelemetry collector.

- The OpenTelemetry collector forwards traces to Jaeger and metrics to Prometheus.

- Prometheus aggregates and stores all metrics.

- Grafana queries Prometheus to produce dashboards.

- Jaeger show traces.

## Usage

1. Install [`kyml`](https://github.com/frigus02/kyml).

   It's used in the deploy scripts to apply Kubernetes manifests.

1. Install [`kind`](https://kind.sigs.k8s.io).

1. Install [`linkerd`](https://linkerd.io/2/getting-started/#step-1-install-the-cli).

1. Start local Kubernetes server:

   ```console
   $ make cluster
   ```

1. Deploy Linkerd

   ```console
   $ make linkerd
   ```

1. Deploy Ingress controller

   ```console
   $ make ingress
   ```

1. Deploy Jaeger

   ```console
   $ make jaeger
   ```

1. Deploy OpenTelemetry Collector

   ```console
   $ make otel-collector
   ```

1. Deploy API:

   ```console
   $ make deploy-api
   ```

## TODO

- Install OpenTelemetry collector
- Configure OpenTelemetry collector:

  - trace receivers: opentelemetry, zipkin for nginx, opencensus for proxies
  - trace exporters: jaeger
  - metrics receivers: opentelemetry
  - metrics exporters: prometheus

- Enable trace collector for API proxy with annotations
- Instrument API
- Install OpenTelemetry agent with API
- Change API Prometheus instrumentation to use OpenTelemetry metrics instead

- Add trace collector to nginx proxies:

  ```
   --trace-collector
   --trace-collector-svc-account
  ```

- Enable tracing for nginx itself
