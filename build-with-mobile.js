import { spawnSync, execSync } from 'child_process';
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

// Cross-platform exec function - find npm in PATH
const findNpm = () => {
  if (platform() === 'win32') {
    // On Windows, try to find npm.cmd or npm
    try {
      // Try to find npm.cmd using where command
      const result = execSync('where npm.cmd', { encoding: 'utf8', stdio: 'pipe' });
      if (result.trim()) {
        return result.trim().split('\r\n')[0].trim();
      }
    } catch (e) {
      // Fall through
    }
    // Fallback to npm (which should work via PATH)
    return 'npm';
  }
  return 'npm';
};

const runCommand = (command, cwd) => {
  const npmCommand = findNpm();
  const args = command.replace(/^npm /, '').split(' ').filter(Boolean);
  
  console.log(`Running: ${npmCommand} ${args.join(' ')} in ${cwd}`);
  
  const result = spawnSync(npmCommand, args, {
    cwd,
    stdio: 'inherit',
    env: { ...process.env },
    shell: false
  });
  
  if (result.error) {
    console.error(`Error running command: ${result.error.message}`);
    process.exit(1);
  }
  
  if (result.status !== 0) {
    console.error(`Command failed with exit code ${result.status}`);
    process.exit(result.status || 1);
  }
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

