# Backend module — placeholder for future Azure Functions / Container Apps
# Uncomment and configure when backend services are needed.

# resource "azurerm_service_plan" "this" {
#   name                = var.name
#   resource_group_name = var.resource_group_name
#   location            = var.location
#   os_type             = "Linux"
#   sku_name            = var.sku_name
#   tags                = var.tags
# }

# resource "azurerm_linux_function_app" "this" {
#   name                       = "${var.name}-func"
#   resource_group_name        = var.resource_group_name
#   location                   = var.location
#   service_plan_id            = azurerm_service_plan.this.id
#   storage_account_name       = var.storage_account_name
#   storage_account_access_key = var.storage_account_access_key
#   tags                       = var.tags
#
#   site_config {
#     application_stack {
#       node_version = "20"
#     }
#   }
#
#   identity {
#     type = "SystemAssigned"
#   }
# }

# resource "azurerm_container_app_environment" "this" {
#   name                = "${var.name}-cae"
#   resource_group_name = var.resource_group_name
#   location            = var.location
#   tags                = var.tags
# }
