#!/bin/bash

set -e

secret_alertmanager() {
    kubectl create secret generic alertmanager-general \
        --dry-run \
        --output yaml \
        --from-file=./config/alertmanager.yaml
}

kubectl apply -f infrastructure/bundle.yml
kubectl wait --for condition=established --timeout=60s crd/prometheuses.monitoring.coreos.com

kyml cat infrastructure/* <(secret_alertmanager) |
    kubectl apply -f -
