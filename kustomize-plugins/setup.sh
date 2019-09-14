#!/bin/bash

set -e

PLUGIN_HOME="$HOME/.config/kustomize/plugin"

IMAGE_RESOLVER_PATH="$PLUGIN_HOME/com.github.frigus.k8s-monitoring-playground/imageresolver"
mkdir -p "$IMAGE_RESOLVER_PATH"
cat >"$IMAGE_RESOLVER_PATH/ImageResolver" <<EOF
#!/bin/sh
kyml resolve
EOF
chmod +x "$IMAGE_RESOLVER_PATH/ImageResolver"
