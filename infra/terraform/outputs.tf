output "resource_group_name" {
  description = "Resource group name"
  value       = module.resource_group.name
}

output "swa_default_hostname" {
  description = "Static Web App default hostname"
  value       = module.static_web_app.default_hostname
}

output "swa_api_key" {
  description = "SWA deployment token (use as GH secret AZURE_STATIC_WEB_APPS_API_TOKEN)"
  value       = module.static_web_app.api_key
  sensitive   = true
}
