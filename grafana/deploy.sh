#!/bin/bash

set -e

configmap_provisioning_datasources() {
    kubectl create configmap grafana-provisioning-datasources \
        --dry-run \
        --output yaml \
        --from-file=prometheus.yml=./config/provisioning/datasources/prometheus.yml
}

configmap_provisioning_dashboards() {
    kubectl create configmap grafana-provisioning-dashboards \
        --dry-run \
        --output yaml \
        --from-file=files.yml=./config/provisioning/dashboards/files.yml
}

configmap_dashboards() {
    kubectl create configmap grafana-dashboards \
        --dry-run \
        --output yaml \
        --from-file=main.json=./config/dashboards/main.json
}

kyml cat infrastructure/* <(configmap_provisioning_datasources) <(configmap_provisioning_dashboards) <(configmap_dashboards) |
    kyml resolve |
    kubectl apply -f -
