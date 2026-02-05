import { readdirSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

export function isPackageExists(name: string): boolean {
  try {
    require.resolve(name);
    return true;
  } catch {
    return false;
  }
}

export function hasTsconfig(): boolean {
  try {
    const entries = readdirSync(process.cwd(), { withFileTypes: true });
    return entries.some(
      (entry) =>
        entry.isFile() && /^tsconfig(\..+)?\.json(?:c|5)?$/.test(entry.name)
    );
  } catch {
    return false;
  }
}
