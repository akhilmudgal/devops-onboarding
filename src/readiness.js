const fs = require('fs');
const { config } = require('./config');
const { readState } = require('./database');

function checkReadiness() {
  const checks = [];

  checks.push({
    name: 'environment_file',
    ok: Boolean(process.env.APP_SECRET || process.env.FEATURE_DEVOPS_PAGE || process.env.DB_PATH),
    message: 'Application environment is loaded'
  });

  checks.push({
    name: 'app_secret',
    ok: config.appSecret.length >= 8,
    message: 'APP_SECRET must be present and at least 8 characters'
  });

  checks.push({
    name: 'feature_flag',
    ok: config.featureDevopsPage,
    message: 'FEATURE_DEVOPS_PAGE must be enabled'
  });

  checks.push({
    name: 'assets_built',
    ok: fs.existsSync(config.buildManifestPath),
    message: 'Static assets must be built before startup'
  });

  const state = readState();
  checks.push({
    name: 'database_migrated',
    ok: Boolean(state && !state.error && state.schemaVersion === 1),
    message: 'Application state database must be migrated'
  });

  checks.push({
    name: 'database_seeded',
    ok: Boolean(state && !state.error && state.flags && state.flags.devopsUnlocked === true),
    message: 'Application state database must be seeded'
  });

  const ready = checks.every((check) => check.ok);
  return { ready, checks };
}

module.exports = { checkReadiness };
