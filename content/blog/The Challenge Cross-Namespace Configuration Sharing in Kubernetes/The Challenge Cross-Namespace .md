# The Challenge: Cross-Namespace Configuration Sharing in Kubernetes
When managing multiple applications on Kubernetes, the standard practice is to group them by use-case or functionality into **Namespaces**. This works perfectly for sharing `ConfigMaps` or `Secrets` within that specific boundary.

<img src="The Challenge Cross-Namesp.png" width="694" height="634">

### The Problem: Configuration Sprawl

As an organization grows, you might manage hundreds of projects across dozens of namespaces. Many of these projects require identical configurations (e.g., global proxy settings, logging sidecars, or common environment variables).

If you stick to standard Kubernetes objects, you end up with **repeated configurations spread across the entire cluster**. This leads to a maintenance nightmare: modifying a single global value requires manual "copy-paste" updates in every namespace, increasing the risk of human error and configuration drift.

#### The solution with Helm lib-chart

Helm now is a standard way to build, deploy and share the software for Kubernetes. With help of lib-chart, you can define common configuration values once and declare them as dependencies in your application charts.

Example configuration:

```yaml
apiVersion: v2
name: mylibchart
description: A Helm chart for Kubernetes
type: Application
version: 0.1.0
appVersion: "1.16.0"
dependencies:
- name: mylibchart
  version: 0.1.0
  repository: file://../mylibchart
```

**The Benefit:** It solves the **DRY (Don't Repeat Yourself)** problem at the template level. 

**The Downside:** It’s still a "push" model. Whenever the global config changes, you must re-release and re-deploy every single application package to see the update.

#### A Dynamic Alternative: The Mutating Webhook

What if we could inject these configurations automatically at runtime? This is where the **Mutating Admission Webhook** comes in.

**What is a Kubernetes Webhook?**

A webhook is an extension point for the Kubernetes API server. When a user creates or updates a resource (like a Deployment), Kubernetes sends that resource to your webhook service via HTTPS. The webhook can then:

1.  **ValidatingWebhook:** Check the resource and reject it if it violates rules.
2.  **MutatingWebhook:** Modify the resource (injecting labels, sidecars, or env vars) before it is saved to `etcd`.

By using a Mutating Webhook, we can "patch" configurations into Deployments regardless of which namespace they land in—no manual PRs or Helm upgrades required.

<img src="1_The Challenge Cross-Namesp.png" width="902" height="699">

#### Implementation Blueprint

1.  Implement the webhook service — a REST API that receives and return AdmissionReview object.
2.  Tell Kubernetes which resources to send to your service. We use a `MutatingWebhookConfiguration`:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: MutatingWebhookConfiguration
metadata:
  name: default-value-webhook
webhooks:
  - name: default-value-webhook.default.svc.cluster.local
    admissionReviewVersions: ["v1"]
    sideEffects: None
    timeoutSeconds: 30
    objectSelector:
      matchLabels:
        resource-webhook-enabled: "true"
    clientConfig:
      service:
        name: default-value-webhook
        namespace: default
        path: "/webhook/default-value"
        port: 8080
      caBundle: "<Base64-encoded CA certificate>"
    rules:
      - operations: ["CREATE", "UPDATE"]
        apiGroups: [""]
        apiVersions: ["v1"]
        resources: ["deployments"]
```

3\. JSON Patch is used for actual modification.

The webhook service doesn't return the whole YAML; it returns a **JSON Patch** (RFC 6902). This tells Kubernetes exactly what to change.

```json
[{"op": "add", "path": "/spec/template/spec/containers/0/env/-", "value": {"name": "GLOBAL_REGION", "value": "us-east-1"}}]
```

#### Critical Considerations

While powerful, building a custom webhook server has some "gotchas" you must prepare for:

*   **HTTPS Only:** Kubernetes requires the webhook to communicate over TLS. Managing these certificates (and rotating them) can be complex.
*   **JSON Patch limitations:** Unlike Helm templates, raw JSON Patches don't support complex logic like `if/else`. And You won't get raw yaml content from request.
*   **Library Support:** The `AdmissionReview` object structure is specific. Ensure your chosen language (Go, Python, etc.) has a robust Kubernetes SDK to handle the serialization.

## Conclusion

Using a Mutating Webhook shifts your configuration management from a **Static/Template** model to a **Dynamic/Runtime** model. It’s a sophisticated approach that’s perfect for platform teams looking to enforce global standards without bothering application developers.

#### Demo projects:

Cluster setup: [https://github.com/YueLiRex/k8s-fluxcd-webhook-cluster](https://github.com/YueLiRex/k8s-fluxcd-webhook-cluster)

Webhook server implementation: [https://github.com/YueLiRex/k8s-fluxcd-webhook-webhook](https://github.com/YueLiRex/k8s-fluxcd-webhook-webhook)