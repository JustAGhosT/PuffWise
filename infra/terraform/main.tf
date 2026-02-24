locals {
  name_prefix = "nl-${var.environment}-${var.project}"

  tags = merge(var.extra_tags, {
    project     = var.project
    environment = var.environment
    managed_by  = "terraform"
  })
}

module "resource_group" {
  source   = "./modules/resource_group"
  name     = "${local.name_prefix}-rg-${var.region_short}"
  location = var.location
  tags     = local.tags
}

module "static_web_app" {
  source              = "./modules/static_web_app"
  name                = "${local.name_prefix}-swa-${var.region_short}"
  resource_group_name = module.resource_group.name
  location            = var.swa_location
  sku_tier            = var.swa_sku_tier
  sku_size            = var.swa_sku_size
  custom_domain       = var.custom_domain
  enable_managed_identity = var.enable_managed_identity
  tags                = local.tags
}

# Uncomment when backend is needed:
# module "backend" {
#   source              = "./modules/backend"
#   name                = "${local.name_prefix}-func-${var.region_short}"
#   resource_group_name = module.resource_group.name
#   location            = module.resource_group.location
#   tags                = local.tags
# }
