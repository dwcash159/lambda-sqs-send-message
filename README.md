# lambda-sql-send
#### Setup the environment
> Install Node 12
- curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
- sudo apt install nodejs

> Switch Node Version
- nvm use 12.20.1

> Update NPM
- npm install npm@latest -g

> configure serverless
- sudo npm install -g serverless
> Deploy
- Deploy to development
    - serverless deploy
- Deploy to production
    - serverless deploy --stage prod 