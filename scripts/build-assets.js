const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const buildDir = path.join(rootDir, 'public', 'build');
fs.mkdirSync(buildDir, { recursive: true });

const css = `
body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Arial, sans-serif;
  background: linear-gradient(135deg, #f8fafc, #e0f2fe);
  color: #0f172a;
}
.container {
  background: white;
  border-radius: 24px;
  padding: 44px;
  width: 680px;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.18);
  border: 1px solid #e2e8f0;
}
.badge {
  display: inline-block;
  background: #dcfce7;
  color: #166534;
  padding: 8px 14px;
  border-radius: 999px;
  font-weight: 700;
  margin-bottom: 18px;
}
h1 {
  font-size: 42px;
  margin: 0 0 16px;
}
p {
  font-size: 18px;
  line-height: 1.6;
}
li {
  margin: 8px 0;
  font-size: 16px;
}
`;

fs.writeFileSync(path.join(buildDir, 'style.css'), css.trim() + '\n');
fs.writeFileSync(path.join(buildDir, 'manifest.json'), JSON.stringify({
  generatedAt: new Date().toISOString(),
  files: ['style.css']
}, null, 2));

console.log('Assets built successfully.');
