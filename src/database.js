const fs = require('fs');
const path = require('path');
const { config } = require('./config');

function readState() {
  if (!fs.existsSync(config.dbPath)) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(config.dbPath, 'utf8'));
  } catch (error) {
    return { error: `Invalid database JSON: ${error.message}` };
  }
}

function writeState(state) {
  fs.mkdirSync(path.dirname(config.dbPath), { recursive: true });
  fs.writeFileSync(config.dbPath, JSON.stringify(state, null, 2));
}

module.exports = { readState, writeState };
