#!/bin/bash

set -e

PLUGIN_HOME="$HOME/.config/kustomize/plugin"

IMAGE_RESOLVER_PATH="$PLUGIN_HOME/com.github.frigus.k8s-monitoring-playground/imageresolver"
mkdir -p "$IMAGE_RESOLVER_PATH"
OS=$(uname | tr '[:upper:]' '[:lower:]')
curl -sfL -o "$IMAGE_RESOLVER_PATH/kyml" "https://github.com/frigus02/kyml/releases/download/v20190906/kyml_20190906_${OS}_amd64"
chmod +x "$IMAGE_RESOLVER_PATH/kyml"
cat >"$IMAGE_RESOLVER_PATH/ImageResolver" <<'EOF'
#!/bin/sh
dir=$(dirname "$0")
"$dir/kyml" resolve
EOF
chmod +x "$IMAGE_RESOLVER_PATH/ImageResolver"
