import { execSync } from 'node:child_process';

// What this build is, for the footer stamp. Workers Builds injects the commit
// (WORKERS_CI_COMMIT_SHA); locally, ask git. Evaluated once per build.
function localSha(): string | undefined {
  try {
    return execSync('git rev-parse HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return undefined;
  }
}

const sha = process.env.WORKERS_CI_COMMIT_SHA || localSha();

export const build = {
  sha,
  short: sha?.slice(0, 7),
  date: new Date().toISOString().slice(0, 10),
};
