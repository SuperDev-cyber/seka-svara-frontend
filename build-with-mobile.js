import { execSync } from 'child_process';
import { existsSync, mkdirSync, cpSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { platform } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const desktopDir = __dirname;
const mobileDir = join(__dirname, '..', 'mobile');
const desktopDist = join(desktopDir, 'dist');
const mobileDist = join(mobileDir, 'dist');
const mobileTarget = join(desktopDist, 'mobile');

// Cross-platform exec function
const runCommand = (command, cwd) => {
  const isWindows = platform() === 'win32';
  const npmCommand = isWindows ? 'npm.cmd' : 'npm';
  const fullCommand = command.replace(/^npm /, `${npmCommand} `);
  
  execSync(fullCommand, {
    cwd,
    stdio: 'inherit',
    shell: true,
    env: { ...process.env }
  });
};

console.log('🏗️  Building desktop app...');
runCommand('npm run build', desktopDir);

console.log('📱 Building mobile app...');
runCommand('npm run build', mobileDir);

if (!existsSync(desktopDist)) {
  console.error('❌ Desktop dist folder not found!');
  process.exit(1);
}

if (!existsSync(mobileDist)) {
  console.error('❌ Mobile dist folder not found!');
  process.exit(1);
}

console.log('📦 Copying mobile app to desktop dist/mobile...');
if (existsSync(mobileTarget)) {
  // Remove existing mobile folder (cross-platform)
  rmSync(mobileTarget, { recursive: true, force: true });
}

// Copy mobile dist to desktop dist/mobile
cpSync(mobileDist, mobileTarget, { recursive: true });

console.log('✅ Build complete! Desktop app at dist/, mobile app at dist/mobile/');

