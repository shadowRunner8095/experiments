const { spawn } = require('child_process');
const fs = require('fs/promises');
const path = require('path');

const appsDir = path.join(__dirname, '..', 'apps');
const rootDistDir = path.join(__dirname, '..', 'dist');

async function runCommand(command, args, cwd) {
  return new Promise((resolve, reject) => {
    console.log(`\n[RUN] ${command} ${args.join(' ')} in ${cwd}`);
    const child = spawn(command, args, { cwd, stdio: 'inherit', shell: true });
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
  });
}

async function build() {
  try {
    // 1. Clean and create the root dist directory
    console.log(`Cleaning and creating root dist directory: ${rootDistDir}`);
    await fs.rm(rootDistDir, { recursive: true, force: true });
    await fs.mkdir(rootDistDir, { recursive: true });

    // 2. Find all apps in the 'apps' directory
    const appFolders = await fs.readdir(appsDir, { withFileTypes: true });

    for (const appFolder of appFolders) {
      if (appFolder.isDirectory()) {
        const appName = appFolder.name;
        const appPath = path.join(appsDir, appName);
        const appPackageJsonPath = path.join(appPath, 'package.json');

        try {
          // Check if package.json exists
          await fs.access(appPackageJsonPath);
          
          // 3. Run the build command for each app
          console.log(`\n--- Building app: ${appName} ---`);
          await runCommand('pnpm', ['build'], appPath);

          // 4. Move the app's dist to the root dist
          const appDistPath = path.join(appPath, 'dist');
          const targetDistPath = path.join(rootDistDir, appName);

          console.log(`Moving ${appDistPath} to ${targetDistPath}`);
          await fs.rename(appDistPath, targetDistPath);
          console.log(`--- Finished app: ${appName} ---`);

        } catch (error) {
          if (error.code === 'ENOENT') {
            console.log(`Skipping ${appName}: no package.json found.`);
          } else {
            console.error(`Failed to process app ${appName}:`, error);
            throw error; // Stop the build on error
          }
        }
      }
    }

    console.log('\n✅ All apps built successfully!');

  } catch (error) {
    console.error('\n❌ Build process failed:', error);
    process.exit(1);
  }
}

build();
