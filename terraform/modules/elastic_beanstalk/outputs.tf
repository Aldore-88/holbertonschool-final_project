output "application_name" {
  description = "Elastic Beanstalk application name"
  value       = aws_elastic_beanstalk_application.backend.name
}

output "environment_name" {
  description = "Elastic Beanstalk environment name"
  value       = aws_elastic_beanstalk_environment.backend.name
}

output "application_url" {
  description = "Application URL"
  value       = "http://${aws_elastic_beanstalk_environment.backend.endpoint_url}"
}

output "security_group_id" {
  description = "Security group ID for EB instances"
  value       = aws_security_group.eb.id
}

output "cname" {
  description = "CNAME for the environment"
  value       = aws_elastic_beanstalk_environment.backend.cname
}
