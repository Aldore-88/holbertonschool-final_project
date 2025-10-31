variable "project_name" {
  description = "Project name for resource naming"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "public_subnet_ids" {
  description = "Public subnet IDs for EB instances"
  type        = list(string)
}

variable "env_vars" {
  description = "Environment variables for the application"
  type        = map(string)
  default     = {}
}
