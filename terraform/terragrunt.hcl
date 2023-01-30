locals {
  env         = read_terragrunt_config("${get_parent_terragrunt_dir()}/environments/${get_env("ENVIRONMENT", "dev")}/env.hcl").locals
  globals     = read_terragrunt_config("${get_parent_terragrunt_dir()}/globals.hcl").locals
  module      = replace(path_relative_to_include(), "modules/", "")
  environment = get_env("ENVIRONMENT", "dev")
  client      = "recognize"
  workload    = "security-reporting"
  version     = "v3.0.0-beta"
}

inputs = {
  location = local.globals.location
}

remote_state {
  backend = "azurerm"
  config = {
    key                  = "${local.module}/terraform.tfstate"
    container_name       = "tfstate"
    resource_group_name  = "rg-recognize-security-reporting-prd"
    storage_account_name = "strecognizesecreptf${local.environment}"
  }
}
