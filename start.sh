export NODE_ENV=production

git fetch
git reset --hard

#Install new modules
npm install --silent

#Stop current server
./node_modules/.bin/forever stopall || true

#Perform any new migrations
#./node_modules/.bin/sequelize --migrate -e production

#Restart application
./node_modules/.bin/forever start app.js -e production
