terraform {
  required_version = ">= 1.6.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }

  backend "azurerm" {}
}

provider "azurerm" {
  features {}
}

module "resource_group" {
  source   = "./modules/resource_group"
  name     = "rg-${var.project}-${var.environment}"
  location = var.location
  tags     = local.tags
}

module "static_web_app" {
  source              = "./modules/static_web_app"
  name                = "swa-${var.project}-${var.environment}"
  resource_group_name = module.resource_group.name
  location            = var.swa_location
  sku_tier            = var.swa_sku_tier
  sku_size            = var.swa_sku_size
  custom_domain       = var.custom_domain
  enable_managed_identity = var.environment == "prod"
  tags                = local.tags
}

# Uncomment when backend is needed:
# module "backend" {
#   source              = "./modules/backend"
#   name                = "${var.project}-${var.environment}"
#   resource_group_name = module.resource_group.name
#   location            = module.resource_group.location
#   tags                = local.tags
# }

locals {
  tags = merge(var.extra_tags, {
    project     = var.project
    environment = var.environment
    managed_by  = "terraform"
  })
}
