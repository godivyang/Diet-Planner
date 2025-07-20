import { defineConfig, loadEnv } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
const { publicVars } = loadEnv({ prefixes: ['REACT_APP_'] });

export default defineConfig({
  source: {
    define: {
      ...publicVars
    },
  },
  plugins: [pluginReact()],
  html: {
    title: "Diet Planner"
  }
});
