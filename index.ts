import antfu from "@antfu/eslint-config";
import defu from "defu";
import { resolveTSConfig } from "pkg-types";

type UserOptions = Parameters<typeof antfu>[0];
type UserConfigs = Parameters<typeof antfu>[1];
type ESLintConfig = ReturnType<typeof antfu>;

// eslint-disable-next-line ts/no-unsafe-assignment, antfu/no-top-level-await, ts/no-unsafe-call
const tsconfigPath = await resolveTSConfig();

export function wrtnlabs(options: UserOptions, ...args: UserConfigs[]): ESLintConfig {
  // eslint-disable-next-line ts/no-unsafe-assignment, ts/no-unsafe-call
  const _options = defu(options, {
    formatters: true,
    typescript: {
      // eslint-disable-next-line ts/no-unsafe-assignment
      tsconfigPath,
    },
    yaml: {
      overrides: {
        indent: 2,
      },
    },
    stylistic: {
      indent: 2,
      quotes: "double",
      semi: true,
      jsx: true,
    },
  } as const satisfies UserOptions);

  // eslint-disable-next-line ts/no-unsafe-call
  return antfu(_options, {
    rules: {
      "no-unreachable": "error",
    },
  }, ...args);
}
