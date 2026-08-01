const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const outputRoot = path.join(projectRoot, 'dist');
const staticEntries = ['index.html', 'css', 'img', 'documents', 'projects'];

fs.rmSync(outputRoot, { recursive: true, force: true });
fs.mkdirSync(outputRoot, { recursive: true });

for (const entry of staticEntries) {
  const source = path.join(projectRoot, entry);
  const destination = path.join(outputRoot, entry);
  fs.cpSync(source, destination, { recursive: true, force: true });
}

const workerOutput = path.join(outputRoot, 'server');
fs.mkdirSync(workerOutput, { recursive: true });
fs.copyFileSync(path.join(projectRoot, 'worker', 'index.js'), path.join(workerOutput, 'index.js'));
