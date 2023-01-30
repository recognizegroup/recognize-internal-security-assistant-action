terraform {
  source = "git::https://github.com/recognizegroup/terraform.git//modules/azure/log_analytics_workspace?ref=${include.locals.version}"
}

include {
  path   = find_in_parent_folders()
  expose = true
}

inputs = {
  name                 = "la-${include.locals.client}-${include.locals.workload}-${include.locals.environment}"
  daily_data_cap_in_gb = 0.1
  resource_group_name  = include.locals.env.resource_group_name
  retention_in_days    = 365
}
