#! /bin/bash
sudo yum update -y

# Install PostgreSQL
sudo yum update -y
sudo amazon-linux-extras enable postgresql14
sudo yum install postgresql-server -y

# Initialize DB
sudo postgresql-setup initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql

echo "==> Checking the postgresql status"
sudo systemctl status postgresql

sudo yum install postgresql-contrib
# sudo find /var/lib/pgsql/data/pg_hba.conf -type f -exec sed -i 's/ident/md5/g' {} \;

# Setup database
# Create a new PostgreSQL database and user
sudo -u postgres psql -c "CREATE DATABASE webapp;"
sudo -u postgres psql -c "CREATE USER admin WITH ENCRYPTED PASSWORD 'admin@123';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE webapp TO admin;"

# Restart PostgreSQL service
sudo systemctl restart postgresql

# Install Nginx
sudo amazon-linux-extras install nginx1

sudo systemctl start nginx
echo "==> Checking the Nginx status"
sudo systemctl status nginx

# NGINX Configuration
sudo mv /tmp/webapp.conf /etc/nginx/conf.d/

sudo systemctl restart nginx
sudo systemctl status nginx

# Install Node.js and NPM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
. ~/.nvm/nvm.sh
nvm install 16
node -e "console.log('Running Node.js ' + process.version)"

echo "==> Checking for npm version"
npm --version
echo "==> Print binary paths"
which node
which npm

# Install pm2 to setup autorun
npm install pm2@latest -g

cat <<EOT >> ~/.bash_profile
export HOST=localhost
export DB_USER=admin
export DB=webapp
export PASSWORD=Boylston@1185
EOT

# Unzip the source code for webapp
unzip /tmp/release.zip -d /home/ec2-user/webapp

# Installing dependencies
cd /home/ec2-user/webapp
npm install

# Run webapp as a background process
pm2 start server.js