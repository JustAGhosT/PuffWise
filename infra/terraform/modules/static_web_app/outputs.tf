output "id" {
  description = "Static Web App resource ID"
  value       = azurerm_static_web_app.this.id
}

output "name" {
  description = "Static Web App name"
  value       = azurerm_static_web_app.this.name
}

output "default_hostname" {
  description = "Default hostname of the Static Web App"
  value       = azurerm_static_web_app.this.default_host_name
}

output "api_key" {
  description = "API key for deployment (sensitive)"
  value       = azurerm_static_web_app.this.api_key
  sensitive   = true
}

output "identity_principal_id" {
  description = "Principal ID of the managed identity (if enabled)"
  value       = try(azurerm_static_web_app.this.identity[0].principal_id, null)
}
