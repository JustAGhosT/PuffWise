include "root" {
  path = find_in_parent_folders()
}

terraform {
  source = "../../terraform"
}

inputs = {
  swa_sku_tier = "Free"
  swa_sku_size = "Free"
}
