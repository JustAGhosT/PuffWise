# Root terragrunt.hcl — shared config for all environments
# Terragrunt DRY configuration: https://terragrunt.gruntwork.io/

locals {
  # Parse the environment from the directory path
  env_vars = read_terragrunt_config("${get_terragrunt_dir()}/env.hcl")
  environment = local.env_vars.locals.environment
  location    = local.env_vars.locals.location
}

# Generate the backend config for each environment
remote_state {
  backend = "azurerm"
  generate = {
    path      = "backend.tf"
    if_exists = "overwrite_terragrunt"
  }
  config = {
    resource_group_name  = "nl-shared-puffwise-rg-san"
    storage_account_name = "nlsharedpuffwisestsan"
    container_name       = "tfstate"
    key                  = "${local.environment}/terraform.tfstate"
  }
}

# Generate the provider config
generate "provider" {
  path      = "provider.tf"
  if_exists = "overwrite_terragrunt"
  contents  = <<EOF
terraform {
  required_version = ">= 1.6.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }
}

provider "azurerm" {
  features {}
}
EOF
}

# Default inputs shared across all environments
inputs = {
  project     = "puffwise"
  environment = local.environment
  location    = local.location
}
