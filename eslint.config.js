import { importx } from "importx";

const { wrtnlabs } = await importx("@wrtnlabs/eslint-config", import.meta.url);

export default wrtnlabs({
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },
});
