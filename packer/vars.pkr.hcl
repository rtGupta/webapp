variable "aws-region" {
  type    = string
  default = env("aws-region")
}

variable "aws-access-key-id" {
  type        = string
  description = "Packer IAM User Access Key"
  default     = env("aws-access-key-id")
}

variable "aws-secret-access-key" {
  type        = string
  description = "Packer IAM User Secret Key"
  default     = env("aws-secret-access-key")
}

variable "ami_users" {
  type    = list(string)
  default = ["999859291911", "741600036362"]
}

variable "instance_type" {
  type    = string
  default = "t2.micro"
}

variable "volume_type" {
  type    = string
  default = "gp2"
}

variable "volume_size" {
  type    = number
  default = 8
}

variable "device_name" {
  type    = string
  default = "/dev/xvda"
}

variable "source_ami" {
  type    = string
  default = "ami-0dfcb1ef8550277af"
}

variable "ssh_username" {
  type    = string
  default = "ec2-user"
}

variable "USER" {
  type    = string
  default = env("USER")
}

variable "PASSWORD" {
  type    = string
  default = env("USER")
}

variable "HOST" {
  type    = string
  default = env("HOST")
}

variable "PORT" {
  type    = string
  default = env("PORT")
}

variable "DB" {
  type    = string
  default = env("DB")
}

variable "DIALECT" {
  type    = string
  default = "postgres"
}