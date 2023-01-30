terraform {
  source = "${get_repo_root()}//terraform/modules/custom/workbook"
}

include {
  path   = find_in_parent_folders()
  expose = true
}

dependency "application_insights" {
  config_path = "../analytics/application_insights"
  mock_outputs = {
    id = "mock_id"
  }
}

inputs = {
  display_name        = "Security Reporting Monitor"
  resource_group_name = include.locals.env.resource_group_name
  json_data           = file("${get_repo_root()}/dashboard/workbook.json")
  source_id           = dependency.application_insights.outputs.id
}
