#!/bin/bash

set -e

TAG=localhost:5000/monitoring-alert-tester

docker build -t $TAG .
docker push $TAG

kustomize build --enable_alpha_plugins infrastructure | kubectl apply -f -
