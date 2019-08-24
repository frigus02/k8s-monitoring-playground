#!/bin/bash

set -e

configmap() {
    kubectl create configmap fluentd \
        --namespace kube-system \
        --dry-run \
        --output yaml \
        --from-file=fluent.conf=./conf/fluent.conf \
        --from-file=kubernetes.conf=./conf/kubernetes.conf \
        --from-file=prometheus.conf=./conf/prometheus.conf
}

kyml cat infrastructure/* <(configmap) |
    kyml resolve |
    kubectl apply -f -
