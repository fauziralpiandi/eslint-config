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
