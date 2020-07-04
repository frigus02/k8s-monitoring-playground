# Kubernetes monitoring playground

> A place to play with monitoring solutions for applications running in a Kubernetes cluster

This contains demo configurations for one application ([api](./api)) and tools to capture traces, generate metrics and show dashboards (Linkerd, OpenTelemetry, Jaeger).

- The API is instrumented and sends OpenTelemetry traces and metrics to the OpenTelemetry collector.

- NGINX Ingress is instrumented and sends OpenTelemetry traces to the OpenTelemetry collector.

- The OpenTelemetry collector forwards traces to Jaeger/Azure Monitor.

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

- Improve documentation of Azure Monitor exporter in opentelemetry-collector-contrib repo
- Add support for events in Azure Monitor exporter
- ResponseCode and ResultCode not set for spans coming from opentelemetry-js (plugin-http). Is that because attribute type is not int/string but Float?
