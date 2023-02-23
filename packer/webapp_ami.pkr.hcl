packer {
  required_plugins {
    amazon = {
      version = ">= 0.0.2"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "aws_region" {
	type = string
	default = "us-east-1"
}

variable "aws_profile" {
	type = string
	default = "packer"
}

variable "aws_access_key" {
  type    = string
  description = "Packer IAM User Access Key"
}

variable "aws_secret_key" {
  type    = string
  description = "Packer IAM User Secret Key"
}

variable "ami_users" {
  type    = list(string)
  default = ["999859291911", "741600036362"]
}

variable "vpc_id" {
	type = string
	description = "Default VPC ID"
	default = "vpc-0eaa06707bdc13cb7"
}

variable "subnet_id" {
	type = string
	description = "Default VPC Subnet ID"
	default = "subnet-0352de491111f1b60"
}

variable "source_ami" {
	type = string
	default = "ami-0dfcb1ef8550277af"
}

variable "ssh_username" {
  type    = string
  default = "ec2-user"
}

source "amazon-ebs" "my-ami-webapp" {
  profile         = "${var.aws_profile}"
  region          = "${var.aws_region}"
  ami_name        = "csye6225_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  ami_description = "CSYE6225 - Cloud - Assignment 04 - Amazon Linux 2 AMI"
  ami_users       = "${var.ami_users}"
  instance_type = "t2.micro"
  source_ami    = "${var.source_ami}"
  ssh_username  = "${var.ssh_username}"
  vpc_id        = "${var.vpc_id}"
  subnet_id     = "${var.subnet_id}"

  aws_polling {
   delay_seconds = 120
   max_attempts  = 50
  }

  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/xvda"
    volume_size           = 8
    volume_type           = "gp2"
  }
}

build {
  name = "build custom ami"
  sources = [
    "source.amazon-ebs.my-ami-webapp"
  ]
  
  provisioner "file" {
    sources = ["./webapp.conf", "../release.zip"]
    destination = "/tmp/"
  }
  
  provisioner "shell" {
    script = "./env_setup.sh"
  }
}
