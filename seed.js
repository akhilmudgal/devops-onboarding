const { readState, writeState } = require('../src/database');

const state = readState();

if (!state || state.schemaVersion !== 1) {
  console.error('Database is not migrated. Run migration first.');
  process.exit(1);
}

state.flags.devopsUnlocked = true;
state.settings.homepageMessage = 'Hello, You are a DevOps!';
state.seededAt = new Date().toISOString();

writeState(state);
console.log('Seed completed.');
