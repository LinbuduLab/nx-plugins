import path from 'path';
import { normalizePath } from '@nrwl/devkit';

export type FileReplacement = {
  replace: string;
  with: string;
};

export type Alias = {
  from: string | RegExp;
  to: string;
};

export function normalizeFileReplacements(
  projectRoot: string,
  fileReplacements: FileReplacement[]
): FileReplacement[] {
  return fileReplacements
    ? fileReplacements.map((fileReplacement) => ({
        replace: path.resolve(projectRoot, fileReplacement.replace),
        with: path.resolve(projectRoot, fileReplacement.with),
      }))
    : [];
}

export function fileReplacements2Alias(
  fileReplacements: FileReplacement[],
  projectSourceRoot: string,
  workspaceRoot: string,
  asRecord = false
): Alias[] {
  const aliases: Alias[] = [];

  fileReplacements.forEach(({ replace, with: target }) => {
    const normalizeReplacePath = normalizePath(replace);
    const normalizeSourcePath = normalizePath(projectSourceRoot);

    const aliasFrom = normalizeReplacePath
      .split(`${normalizeSourcePath}/`)[1]
      .replace('.ts', '');

    const aliasFromRegExp = new RegExp(aliasFrom);
    const aliasTo = path.resolve(workspaceRoot, target);

    aliases.push({
      from: aliasFromRegExp,
      to: aliasTo,
    });
  });

  return aliases;
}
