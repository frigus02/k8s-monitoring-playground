#!/bin/bash

set -e

TAG=localhost:5000/monitoring-alert-tester

docker build -t $TAG .
docker push $TAG

kyml cat infrastructure/* |
    kyml resolve |
    kubectl apply -f -
