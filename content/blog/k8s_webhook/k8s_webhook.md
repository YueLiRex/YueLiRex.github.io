---
title: "Practical Example of Using Mutating Admission Webhook"
description: ""
summary: ""
date: 2025-10-20T16:27:22+02:00
lastmod: 2025-10-20T16:27:22+02:00
draft: false
weight: 40
categories: []
tags: []
contributors: []
pinned: false
homepage: false
seo:
  title: "Practicle example with k8s webhooks" # custom title (optional)
  description: "Implement a webhooks server to serve your own purpose" # custom description (recommended)
  canonical: "" # custom canonical URL (optional)
  noindex: false # false (default) or true
---

In our current project, we face a challenge: managing around 40 data pipeline applications, some of which consist of multiple components.

Each application needs to be deployed to multiple environments — dev, int, pre-live, and live. We package them as Helm charts and deploy them to Kubernetes.

**The problem?**

Many configuration values are the same across applications. If we need to modify one of them — for example, health check settings — we must update the Helm values for every single pipeline, which is tedious and error-prone.

**Our current approach**

We use a shared lib-helm chart to centralize common configuration. This way, we only need to update lib-helm to change defaults.

However, promoting these changes to production still requires manual pull requests to update the Helm chart version in each application’s repo. For 40+ applications, this is still a lot of repetitive work.

**This led us to ask:**

Can we apply configuration changes automatically, without touching each repository?

That’s when we discovered Kubernetes Mutating Admission Webhooks.

**What is a Kubernetes Webhook?**

A webhook is an extension point for the Kubernetes API server.

When you create or update a resource (e.g., a Pod or Deployment), Kubernetes can send that resource to a webhook service via HTTP(S). The webhook can validate or mutate the object before it is persisted in etcd.


There are two types:

- ValidatingWebhook — checks a resource and can reject it if it doesn’t meet certain criteria.
- MutatingWebhook — modifies a resource before it is stored.

In our case, a Mutating Webhook can inject or override default values into Deployments at creation or update time — no manual PRs required.

**Steps to Use a Mutating Webhook**

1. Implement the webhook service — a REST API that receives AdmissionReview requests and returns a JSON Patch with modifications.
2. Register it in Kubernetes — using a MutatingWebhookConfiguration.

**1. Implementing the MutatingWebhook Server**

A webhook server is just a REST API that:

Receives an AdmissionReview request from the Kubernetes API server.

Applies business logic to modify the resource.

Returns a JSON Patch describing the changes.

In my case, I’m using Pekko-HTTP, but you can use any framework.

**JSON Patch**

A JSON Patch is an array of operations with path and value describe the acts we want to apply

1. add
2. remove
3. replace
4. move
5. copy
6. test

Example JSON Patch

```json
[
    { "op": "replace", "path": "/message", "value": "Patching JSON is fun" },
    { "op": "add", "path": "/with", "value": "jsonpatch.me" },
    { "op": "remove", "path": "/from" }
]
```

1. **Configuring Kubernetes to Use the Webhook**

Example MutatingWebhookConfiguration:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: MutatingWebhookConfiguration
metadata:
  name: default-value-webhook
webhooks:
  - name: default-value-webhook.default.svc.cluster.local
    admissionReviewVersions:
      - "v1"
    sideEffects: "None"
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
      - operations: [ "CREATE", "UPDATE" ]
        apiGroups: [""]
        apiVersions: ["v1"]
        resources: ["deployment"]
```

**Important Details**

- Path — must match the one in your server, e.g. /webhook/default-value.
- HTTPS only — Kubernetes requires TLS; the caBundle contains your CA cert in base64.
- Selective application — use objectSelector only to mutate resources with specific labels (avoids touching everything).

Why this helps us

With this setup:

- We no longer need to bump Helm chart versions across 40+ repos for small config changes.
- Any change to the defaults can be applied cluster-wide instantly.
- We still keep Helm values for application-specific overrides.

This removes a huge amount of manual PR work and ensures consistent configuration across environments.
