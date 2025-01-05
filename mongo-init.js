print('Start creating database ##########################');
const name_base = process.env.MONGO_DB_NAME;
const dbPass = process.env.MONGO_INITDB_ROOT_PASSWORD;
const user = process.env.MONGO_INITDB_ROOT_USERNAME;
db = db.getSiblingDB(name_base);

db.createUser({
  pwd: dbPass,
  user: user,
  roles: [{ role: 'readWrite', db: name_base }],
});

db.ping.insertOne({ msg: 'pong' });

print('End creating database ##########################');
