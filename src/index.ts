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
      overrides: {
        "ts/no-namespace": "warn", // namespace is not recommended, but we have a lot of namespaces, so now we just warn
      },
      overridesTypeAware: {
        "ts/strict-boolean-expressions": ["error", { allowNullableBoolean: false, allowNullableObject: false, allowString: false }], // compare with `null` and `undefined` is not allowed
      },
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
      overrides: {
        "antfu/top-level-function": "error", // https://github.com/antfu/eslint-plugin-antfu/blob/main/src/rules/top-level-function.md this is one of the opinionated rules and Deno also use this rule https://docs.deno.com/runtime/contributing/style_guide/#top-level-functions-should-not-use-arrow-syntax
      },
    },
  } as const satisfies UserOptions);

  return antfu(_options, {
    rules: {
      "no-unreachable": "error",
      "no-redeclare": "warn", // for type hierarchy structure(ex: ChatCompletion.Choice)
    },
  }, ...args);
}
