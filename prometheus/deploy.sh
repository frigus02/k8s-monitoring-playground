#!/bin/bash

set -e

secret_alertmanager() {
    kubectl create secret generic alertmanager-general \
        --dry-run \
        --output yaml \
        --from-file=./config/alertmanager.yaml
}

kyml cat infrastructure/* <(secret_alertmanager) |
    kubectl apply -f -
