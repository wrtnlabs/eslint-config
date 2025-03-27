/* eslint-disable ts/no-unsafe-member-access */
/* eslint-disable ts/no-unsafe-assignment */
import type { TypedFlatConfigItem } from "@antfu/eslint-config";
import { interopDefault } from "@antfu/eslint-config";

export async function next(enabled = false): Promise<TypedFlatConfigItem[]> {
  if (!enabled) {
    return [];
  }

  // @ts-expect-error no dts
  const nextPlugin: any = await interopDefault(import("@next/eslint-plugin-next"));
  return [
    {
      plugins: {
        "@next/next": nextPlugin,
      },
      rules: {
        ...nextPlugin.configs.recommended.rules,
        ...nextPlugin.configs["core-web-vitals"].rules,
      },
    },
  ];
}
