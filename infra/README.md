# Infrastructure — PuffWise

IaC for PuffWise using Terraform + Terragrunt + Terrateam on Azure.

## Architecture

```text
Azure (southafricanorth)
├── nl-{env}-puffwise-rg-san     (Resource Group)
│   └── nl-{env}-puffwise-swa-san (Static Web App, hosted in westeurope*)
│       ├── Custom domain (prod only, optional)
│       └── Managed identity (prod only)
└── [Future] nl-{env}-puffwise-func-san (Azure Functions / Container Apps)

* SWA does not yet support southafricanorth; deployed to westeurope.
```

## Directory Structure

```text
infra/
├── terraform/
│   ├── main.tf              # Root module composing all sub-modules
│   ├── variables.tf          # Input variables
│   ├── outputs.tf            # Outputs (SWA hostname, API key)
│   └── modules/
│       ├── resource_group/   # Azure Resource Group
│       ├── static_web_app/   # Azure Static Web App + custom domain
│       └── backend/          # Placeholder for Functions/Container Apps
├── terragrunt/
│   ├── terragrunt.hcl        # Root config (remote state, provider)
│   ├── dev/                  # Dev environment overrides
│   ├── staging/              # Staging environment overrides
│   └── prod/                 # Prod environment overrides (Standard SKU)
└── README.md                 # This file
```

## Prerequisites

1. **Azure subscription** with a service principal or
   OIDC federated credential
2. **Terraform state storage** — create before first run:
   ```bash
   az group create -n nl-shared-puffwise-rg-san -l southafricanorth
   az storage account create -n nlsharedpuffwisestsan \
     -g nl-shared-puffwise-rg-san -l southafricanorth --sku Standard_LRS
   az storage container create -n tfstate \
     --account-name nlsharedpuffwisestsan
   ```
3. **Terragrunt** >= 0.68 and **Terraform** >= 1.6

## Required GitHub Secrets

| Secret                            | Description                                                     |
| --------------------------------- | --------------------------------------------------------------- |
| `AZURE_CLIENT_ID`                 | Service principal / OIDC app client ID                          |
| `AZURE_TENANT_ID`                 | Azure AD tenant ID                                              |
| `AZURE_SUBSCRIPTION_ID`           | Target Azure subscription                                       |
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | SWA deployment token (from `terraform output -raw swa_api_key`) |

Set these per environment in **Settings → Environments → {dev,staging,prod}**.

## Usage

### Local development

```bash
cd infra/terragrunt/dev
terragrunt init
terragrunt plan
terragrunt apply
```

### CI/CD

- **PR:** `infra-ci.yml` runs `terragrunt plan` per affected environment
  and posts the plan as a PR comment.
- **Merge to main:** `infra-ci.yml` runs `terragrunt apply` sequentially.
- **Terrateam:** Also monitors `infra/` changes and can run plan/apply
  via PR comments (`terrateam plan`, `terrateam apply`).

### App deployment

- **PR:** `app-ci.yml` runs lint, typecheck, test, build.
- **Merge to main:** `app-ci.yml` deploys the build to Azure SWA (dev).

## Environments

| Env     | SWA SKU  | Managed Identity | Custom Domain |
| ------- | -------- | ---------------- | ------------- |
| dev     | Free     | No               | No            |
| staging | Free     | No               | No            |
| prod    | Standard | Yes              | Configurable  |
