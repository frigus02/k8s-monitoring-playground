#!/bin/bash

set -e

configmap_provisioning_datasources() {
    kubectl create configmap grafana-provisioning-datasources \
        --dry-run \
        --output yaml \
        --from-file=./config/provisioning/datasources/
}

configmap_provisioning_dashboards() {
    kubectl create configmap grafana-provisioning-dashboards \
        --dry-run \
        --output yaml \
        --from-file=./config/provisioning/dashboards/
}

configmap_dashboards() {
    kubectl create configmap grafana-dashboards \
        --dry-run \
        --output yaml \
        --from-file=./config/dashboards/
}

kyml cat infrastructure/* <(configmap_provisioning_datasources) <(configmap_provisioning_dashboards) <(configmap_dashboards) |
    kyml resolve |
    kubectl apply -f -
