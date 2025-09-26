#!/usr/bin/env node
import { readFile } from 'fs/promises';
import { resolve } from 'path';

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Usage: node make-data-url.mjs <html-file>');
    process.exit(1);
  }
  const absolutePath = resolve(filePath);
  const html = await readFile(absolutePath);
  const base64 = html.toString('base64');
  const url = `data:text/html;base64,${base64}`;
  console.log(url);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
