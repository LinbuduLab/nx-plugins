export type NormalizedCommandItem = {
  command: string;
  forwardAllArgs?: boolean;
};

export type CommandItem = NormalizedCommandItem | string;

export interface DevkitExecSchema {
  command?: string;
  commands: CommandItem[];
  color?: boolean;
  parallel?: boolean;
  cwd?: string;
  args?: string;
  envFile?: string;
  outputPath?: string;
  stdio?: 'ignore' | 'pipe' | 'inherit';
  forceKillAfterTimeout?: boolean | number;
}

export interface NormalizedExecSchema extends DevkitExecSchema {
  commands: NormalizedCommandItem[];
  parsedArgs: Record<string, string>;
}

export type SchemaProps = keyof DevkitExecSchema;

export const schemaProps: (SchemaProps | string)[] = [
  'command',
  'commands',
  'color',
  'parallel',
  'cwd',
  'args',
  'envFile',
  'outputPath',
  'stdio',
  'forceKillAfterTimeout',
];
