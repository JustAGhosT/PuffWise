include "root" {
  path = find_in_parent_folders()
}

terraform {
  source = "../../terraform"
}

inputs = {
  subscription_id = get_env("ARM_SUBSCRIPTION_ID")
  swa_sku_tier    = "Free"
  swa_sku_size    = "Free"
}
