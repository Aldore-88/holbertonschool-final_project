variable "project_name" {
  description = "Project name for resource naming"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "backend_api_url" {
  description = "Backend API URL for CORS configuration"
  type        = string
}
