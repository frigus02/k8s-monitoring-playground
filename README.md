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

1. Start local Docker registry:

   ```console
   $ make registry
   ```

1. Start local Kubernetes server:

   ```console
   $ make cluster
   ```

1. Deploy API:

   ```console
   $ make deploy-api
   ```
