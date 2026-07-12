const fs = require('fs');
const path = require('path');
const express = require('express');
const { config, ensureLogDir } = require('./config');
const { checkReadiness } = require('./readiness');

ensureLogDir();
const app = express();

app.use('/static', express.static(path.join(config.rootDir, 'public')));

function logEvent(level, event, details = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    event,
    ...details
  };

  fs.appendFileSync(
    path.join(config.logDir, 'app.log'),
    JSON.stringify(entry) + '\n'
  );

  const writer = level === 'error' ? console.error : console.log;
  writer(JSON.stringify(entry));
}

app.get('/health', (req, res) => {
  const readiness = checkReadiness();
  res.status(readiness.ready ? 200 : 503).json({
    status: readiness.ready ? 'ok' : 'not_ready',
    service: 'devops-onboarding-activity',
    checks: readiness.checks
  });
});

app.get('/', (req, res) => {
  const readiness = checkReadiness();

  if (!readiness.ready) {
    logEvent('error', 'application_not_ready', {
      failedChecks: readiness.checks.filter((check) => !check.ok).map((check) => check.name)
    });

    return res.status(503).send(`
      <!doctype html>
      <html>
        <head>
          <title>Application Not Ready</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 48px; color: #111827; }
            .card { max-width: 760px; border: 1px solid #e5e7eb; border-radius: 16px; padding: 28px; box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
            h1 { color: #b91c1c; }
            code { background: #f3f4f6; padding: 3px 6px; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Application is not ready</h1>
            <p>The app is running, but one or more readiness checks failed.</p>
            <p>Check <code>/health</code> and server logs to investigate.</p>
          </div>
        </body>
      </html>
    `);
  }

  logEvent('info', 'homepage_served', { path: req.path });

  res.status(200).send(`
    <!doctype html>
    <html>
      <head>
        <title>Hello DevOps</title>
        <link rel="stylesheet" href="/static/build/style.css" />
      </head>
      <body>
        <main class="container">
          <div class="badge">Ready</div>
          <h1>Hello, You are a DevOps!</h1>
          <p>You successfully discovered the missing setup steps and made the app production-ready.</p>
          <ul>
            <li>Environment configured</li>
            <li>Assets built</li>
            <li>Database migrated</li>
            <li>Database seeded</li>
          </ul>
        </main>
      </body>
    </html>
  `);
});

app.listen(config.port, () => {
  logEvent('info', 'server_started', {
    port: config.port,
    appEnv: config.appEnv,
    dbPath: config.dbPath,
    logDir: config.logDir
  });
});
