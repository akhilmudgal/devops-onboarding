const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const rootDir = path.resolve(__dirname, '..');

function resolveFromRoot(value, fallback) {
  const target = value || fallback;
  if (!target) return null;
  return path.isAbsolute(target) ? target : path.join(rootDir, target);
}

const config = {
  rootDir,
  port: Number(process.env.PORT || 3000),
  appEnv: process.env.APP_ENV || 'local',
  appSecret: process.env.APP_SECRET || '',
  featureDevopsPage: process.env.FEATURE_DEVOPS_PAGE === 'true',
  dbPath: resolveFromRoot(process.env.DB_PATH, './data/app-state.json'),
  logDir: resolveFromRoot(process.env.LOG_DIR, './logs'),
  buildManifestPath: path.join(rootDir, 'public', 'build', 'manifest.json')
};

function ensureLogDir() {
  if (!fs.existsSync(config.logDir)) {
    fs.mkdirSync(config.logDir, { recursive: true });
  }
}

module.exports = { config, ensureLogDir };
