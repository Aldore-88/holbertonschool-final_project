# Variables for Flora Marketplace Infrastructure

variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "ap-southeast-2" # Sydney region
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "flora"
}

variable "environment" {
  description = "Environment name (dev, staging, production)"
  type        = string
  default     = "production"
}

# Database Variables
variable "database_name" {
  description = "PostgreSQL database name"
  type        = string
  default     = "flora_db"
}

variable "database_username" {
  description = "PostgreSQL master username"
  type        = string
  sensitive   = true
}

variable "database_password" {
  description = "PostgreSQL master password"
  type        = string
  sensitive   = true
}

# Auth0 Variables
variable "auth0_domain" {
  description = "Auth0 domain"
  type        = string
  default     = "dev-ijvur34mojpovh8e.us.auth0.com"
}

variable "auth0_client_id" {
  description = "Auth0 client ID"
  type        = string
  default     = "tegmEuc40IvXfYFDLIRnJmbsa1izkTVL"
}

variable "auth0_client_secret" {
  description = "Auth0 client secret"
  type        = string
  sensitive   = true
}

variable "auth0_audience" {
  description = "Auth0 API audience"
  type        = string
  default     = "https://flora-api.com"
}

# Stripe Variables
variable "stripe_secret_key" {
  description = "Stripe secret key"
  type        = string
  sensitive   = true
}

variable "stripe_publishable_key" {
  description = "Stripe publishable key (for frontend)"
  type        = string
}
