include "root" {
  path = find_in_parent_folders()
}

terraform {
  source = "../../terraform"
}

inputs = {
  subscription_id         = get_env("ARM_SUBSCRIPTION_ID", "")
  swa_sku_tier            = "Standard"
  swa_sku_size            = "Standard"
  enable_managed_identity = true
  # TODO: set custom_domain to real domain before production launch
}
