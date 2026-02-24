variable "name" {
  description = "Static Web App name"
  type        = string
}

variable "resource_group_name" {
  description = "Resource group to deploy into"
  type        = string
}

variable "location" {
  description = "Azure region (SWA supports: centralus, eastus2, eastasia, westeurope, westus2)"
  type        = string
}

variable "sku_tier" {
  description = "SWA SKU tier"
  type        = string
  default     = "Free"
}

variable "sku_size" {
  description = "SWA SKU size"
  type        = string
  default     = "Free"
}

variable "custom_domain" {
  description = "Optional custom domain to bind"
  type        = string
  default     = null
}

variable "enable_managed_identity" {
  description = "Enable system-assigned managed identity (needed for backend API integration)"
  type        = bool
  default     = false
}

variable "tags" {
  description = "Tags to apply"
  type        = map(string)
  default     = {}
}
