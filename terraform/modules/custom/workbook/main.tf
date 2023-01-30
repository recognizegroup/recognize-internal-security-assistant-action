terraform {
  required_version = ">=1.1.2"

  required_providers {
    azurerm = "=3.41.0"
    random = {
      source = "hashicorp/random"
      version = "3.4.3"
    }
  }

  backend "azurerm" {}
}

provider "azurerm" {
  features {}
}

# Generate a random UUID
resource "random_uuid" "workbook_name" {
}

resource "azurerm_application_insights_workbook" "workbook" {
  name                = random_uuid.workbook_name.result
  resource_group_name = var.resource_group_name
  location            = var.location
  display_name        = var.display_name
  data_json           = var.json_data
  source_id           = lower(var.source_id)
}
