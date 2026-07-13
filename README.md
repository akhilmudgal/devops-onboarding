npm install
cp .env.example .env


Edit .env:

PORT=3000
APP_ENV=local
APP_SECRET=supersecret123
FEATURE_DEVOPS_PAGE=true
DB_PATH=./data/app-state.json
LOG_DIR=./logs


Then run:

npm run build
npm run migrate
npm run seed
npm start


Open:

http://localhost:3000


Health endpoint:

http://localhost:3000/health


Logs:

logs/app.log
