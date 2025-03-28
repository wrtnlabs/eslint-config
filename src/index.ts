import antfu from "@antfu/eslint-config";
import defu from "defu";
import { resolveTSConfig } from "pkg-types";

import type { ESLintConfig, UserConfigs, UserOptions } from "./options";

export async function wrtnlabs(options: UserOptions, ...args: UserConfigs[]): Promise<ESLintConfig> {
// get tsconfig.json path, if it does not exist, it will be undefined
  const tsconfigPath = await resolveTSConfig().catch(() => undefined);

  const _options = defu(options, {
    lessOpinionated: true,
    formatters: true,
    typescript: {
      tsconfigPath,
      overrides: {
        // ref: https://github.com/wrtnlabs/eslint-config/issues/11

        // "ts/no-redeclare": "warn", // for type hierarchy structure(ex: ChatCompletion.Choice)
        // "ts/no-namespace": "warn", // namespace is not recommended, but we have a lot of namespaces, so now we just warn
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

  if (typeof _options.typescript !== "boolean" && _options?.typescript?.tsconfigPath == null) {
    console.warn("tsconfig.json is not found. we cannot use type-aware rules.");
  }

  return antfu(_options, {
    rules: {
      "no-unreachable": "error",
      // sort-imports and import/order have conflicting rules. Therefore, we disable sort-imports.
      "perfectionist/sort-imports": "off",
      "import/order": ["error", {
        "groups": ["builtin", "external", "internal", "index", "type"],
        "newlines-between": "always",
        "sortTypesGroup": false,
      }],
    },
  }, ...args);
}
