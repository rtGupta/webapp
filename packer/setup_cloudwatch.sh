#! /bin/bash
sudo yum update -y

# Download the CloudWatch Agent
sudo wget https://s3.amazonaws.com/amazoncloudwatch-agent/amazon_linux/amd64/latest/amazon-cloudwatch-agent.rpm

# Install the package
sudo rpm -U ./amazon-cloudwatch-agent.rpm
