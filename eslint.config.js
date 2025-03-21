import { importx } from "importx";

const { wrtnlabs } = await importx("./src/index.ts", import.meta.url);

export default wrtnlabs({
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },
});
