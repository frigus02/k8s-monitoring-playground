#!/bin/bash
set -eu

# create registry container unless it already exists
reg_name='kind-registry'
reg_port='5000'
running="$(docker inspect -f '{{.State.Running}}' "$reg_name" 2>/dev/null || true)"
if [ "$running" != 'true' ]; then
	echo "Starting registry..."
	docker run \
		-d \
		--restart=always \
		-p "$reg_port:5000" \
		--name "$reg_name" \
		registry:2
fi

# create a cluster with the local registry enabled in containerd
if ! kind get clusters | grep kind >/dev/null; then
	echo "Creating cluster..."
	cat <<EOF | kind create cluster --config=-
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
containerdConfigPatches:
- |-
  [plugins."io.containerd.grpc.v1.cri".registry.mirrors."localhost:$reg_port"]
    endpoint = ["http://$reg_name:$reg_port"]
nodes:
- role: control-plane
  kubeadmConfigPatches:
  - |
    kind: InitConfiguration
    nodeRegistration:
      kubeletExtraArgs:
        node-labels: "ingress-ready=true"
  extraPortMappings:
  - containerPort: 80
    hostPort: 80
    protocol: TCP
  - containerPort: 443
    hostPort: 443
    protocol: TCP
EOF
fi

# connect the registry to the cluster network
if ! docker network inspect kind | grep registry >/dev/null; then
	echo "Connecting cluster network to registry..."
	docker network connect "kind" "$reg_name"
fi

# tell https://tilt.dev to use the registry
# https://docs.tilt.dev/choosing_clusters.html#discovering-the-registry
echo "Annotating nodes..."
for node in $(kind get nodes); do
	kubectl annotate node "$node" "kind.x-k8s.io/registry=localhost:$reg_port";
done
