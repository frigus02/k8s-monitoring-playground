#!/bin/bash

set -e

kubectl apply -f infrastructure/bundle.yml
kubectl wait --for condition=established --timeout=60s crd/prometheuses.monitoring.coreos.com

kubectl apply -k infrastructure
