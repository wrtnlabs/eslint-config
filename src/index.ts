import antfu from "@antfu/eslint-config";
import defu from "defu";
import { resolveTSConfig } from "pkg-types";

type UserOptions = Parameters<typeof antfu>[0];
type UserConfigs = Parameters<typeof antfu>[1];
type ESLintConfig = ReturnType<typeof antfu>;

// eslint-disable-next-line antfu/no-top-level-await
const tsconfigPath = await resolveTSConfig();

export async function wrtnlabs(options: UserOptions, ...args: UserConfigs[]): Promise<ESLintConfig> {
  const _options = defu(options, {
    lessOpinionated: true,
    formatters: true,
    typescript: {
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

  return antfu(_options, {
    rules: {
      "no-unreachable": "error",
      "ts/no-namespace": "warn",
    },
  }, ...args);
}
