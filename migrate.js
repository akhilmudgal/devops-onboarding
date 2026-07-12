const { writeState } = require('../src/database');

writeState({
  schemaVersion: 1,
  migratedAt: new Date().toISOString(),
  flags: {},
  settings: {}
});

console.log('Migration completed.');
