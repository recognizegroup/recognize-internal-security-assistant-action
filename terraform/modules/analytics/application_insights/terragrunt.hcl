terraform {
  source = "git::https://github.com/recognizegroup/terraform.git//modules/azure/application_insights?ref=${include.locals.version}"
}

include {
  path   = find_in_parent_folders()
  expose = true
}

dependency "log_analytics_workspace" {
  config_path = "../log_analytics_workspace"
  mock_outputs = {
    id = "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg-analytics/providers/Microsoft.OperationalInsights/workspaces/la-ai"
  }
}

inputs = {
  name                       = "ai-${include.locals.client}-${include.locals.workload}-${include.locals.environment}"
  daily_data_cap_in_gb       = 0.1
  resource_group_name        = include.locals.env.resource_group_name
  log_analytics_workspace_id = dependency.log_analytics_workspace.outputs.id
  sampling_percentage        = 100.0
  retention_in_days          = 365
}
