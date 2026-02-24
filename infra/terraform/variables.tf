variable "project" {
  description = "Project name used in resource naming"
  type        = string
  default     = "puffwise"
}

variable "environment" {
  description = "Deployment environment (dev, staging, prod)"
  type        = string

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod."
  }
}

variable "location" {
  description = "Azure region for the resource group"
  type        = string
  default     = "southafricanorth"
}

variable "region_short" {
  description = "Short region code used in naming convention (e.g. san, weu, eus2)"
  type        = string
  default     = "san"
}

variable "swa_location" {
  description = "Azure region for Static Web App (limited: centralus, eastus2, eastasia, westeurope, westus2). SWA does not yet support southafricanorth."
  type        = string
  default     = "westeurope"
}

variable "swa_sku_tier" {
  description = "SWA SKU tier (Free or Standard)"
  type        = string
  default     = "Free"
}

variable "swa_sku_size" {
  description = "SWA SKU size"
  type        = string
  default     = "Free"
}

variable "custom_domain" {
  description = "Optional custom domain to bind to the SWA"
  type        = string
  default     = null
}

variable "extra_tags" {
  description = "Additional tags to apply to all resources"
  type        = map(string)
  default     = {}
}
