variable "resource_group_name" {
  type        = string
  description = "Name of the resource group."
}

variable "location" {
  type        = string
  description = "Location of the Azure Workbook"
}

variable "json_data" {
  type        = string
  description = "JSON data for the Azure Workbook"
}

variable "display_name" {
  type        = string
  description = "Display name for the Azure Workbook"
}

variable "source_id" {
  type        = string
  description = "Source ID for the Azure Workbook"
}
