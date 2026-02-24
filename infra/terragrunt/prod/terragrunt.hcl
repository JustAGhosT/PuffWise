include "root" {
  path = find_in_parent_folders()
}

terraform {
  source = "../../terraform"
}

inputs = {
  swa_sku_tier            = "Standard"
  swa_sku_size            = "Standard"
  enable_managed_identity = true
  # custom_domain = "puffwise.example.com"
}
