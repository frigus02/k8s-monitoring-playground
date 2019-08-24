#!/bin/bash

set -e

kyml cat infrastructure/* |
    kubectl apply -f -
