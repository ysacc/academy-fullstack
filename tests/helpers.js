const fs = require('fs');
const path = require('path');

function collectFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const p = path.join(dir, entry.name);
    return entry.isDirectory() ? collectFiles(p) : [p];
  });
}

function runWeek({ week, dir, requiredFiles = [], patterns = [] }) {
  const base = path.join(process.cwd(), dir, 'solution');
  const files = collectFiles(base);
  const text = files.map((f) => fs.readFileSync(f, 'utf8')).join('\n');
  const results = [];

  for (const file of requiredFiles) {
    results.push({ name: `Existe ${file}`, ok: files.some((f) => f.endsWith(file)) });
  }
  for (const item of patterns) {
    results.push({ name: item.name, ok: item.regex.test(text) });
  }

  console.log(`\n🧪 Academy Full Stack — Semana ${week}\n`);
  if (!files.length) {
    console.error(`❌ No se encontró la carpeta de solución: ${base}\n`);
    process.exit(1);
  }
  for (const r of results) console.log(`${r.ok ? '✅' : '❌'} ${r.name}`);
  const failed = results.filter((r) => !r.ok).length;
  console.log(`\nResultado: ${results.length - failed}/${results.length}`);
  if (failed) process.exit(1);
  console.log('🎉 Validación técnica mínima aprobada. Falta Code Review humano.\n');
}

module.exports = { runWeek };
