#!/bin/bash

set -e

configmap() {
    kubectl create configmap fluentd \
        --dry-run \
        --output yaml \
        --from-file=./config/
}

kyml cat infrastructure/* <(configmap) |
    kyml resolve |
    kubectl apply -f -
