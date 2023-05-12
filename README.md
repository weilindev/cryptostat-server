# deploy guideline

**step 1**

login to aws console and create an ec2 instance

**step 2**

copy downloaded private key to WSL

		cp /mnt/<Windows drive letter>/path/my-key-pair.pem ~/WSL-path/my-key-pair.pem

set the permission of my private key

		chmod 400 key-pair-name.pem

connect instance by ssh using ssh config

		vim ~/.ssh/config

		Host {{NAME}}
        Hostname {{HOSTNAME}}
        User {{USER}}
        identityfile {{KEY_FILE_LOCATION}}

**step 3**

Login to ec2 instance

		ssh {{NAME}}

**step 4**

install  nvm & nodejs & yarn & nginx

		// nvm
		sudo apt update
		sudo apt install curl 
		curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
		source ~/.bashrc

		// node.js
		nvm install {{version}}
		or
		nvm install --lts

		// yarn
		sudo npm install -g corepack
		corepack enable
		corepack prepare yarn@stable --activate
		yarn set version stable

		// nginx
		sudo apt-get install nginx

**step 5**

push your projects to github 

**step 6**

create github action 

it will create a yml file under .github/workflow

just edit yml file acording to your project

**step 7**

set up github action on ec2

Not start with sudo 

After GitHub configuration run this command

sudo ./svc.sh install

sudo ./svc.sh start

**step 8**

install pm2 and run backend in background

npm i pm2 -g 

pm2 start server.js 

**step 9**

add  the command in yml script of project to restart after every commit 

-run: sudo pm2 restart server.js

step 9- 

config nginx and restart it 

Cd /etc/nginx

Cd sites-available

sudo nano default


    location /api/ {

        proxy_pass  http://localhost:8000/;

        proxy_set_header Host $host;

        proxy_set_header X-Real-IP $remote_addr;

        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

    }

sudo systemctl restart nginx