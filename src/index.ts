import antfu from "@antfu/eslint-config";
import defu from "defu";
import { resolveTSConfig } from "pkg-types";

import type { ESLintConfig, UserConfigs, UserOptions } from "./options";

import { next, tailwindCss } from "./rules";

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
        "ts/no-redeclare": "off", // for type hierarchy structure(ex: ChatCompletion.Choice)
        "ts/no-namespace": "off", // namespace is not recommended, but we have a lot of namespaces, so now we just warn
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

  const tailwindRules = await tailwindCss(_options.tailwindcss);
  const nextJsRules = await next(_options.next);

  return antfu(
    _options,
    {
      rules: {
        "no-unreachable": "error",
        // sort-imports and import/order have conflicting rules. Therefore, we disable import/order.
        "perfectionist/sort-imports": ["error", {
          order: "asc",
          groups: ["builtin", "type", "external", "internal-type", "internal", "parent-type", "parent", "sibling-type", "sibling", "index-type", "index"],
        }],
        "import/order": "off",
      },
    },
    ...tailwindRules,
    ...nextJsRules,
    ...args,
  );
}
