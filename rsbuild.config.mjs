import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

// for .env variables
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });
const envVars = {};
for (const key in process.env) {
  if (key.startsWith('REACT_APP_')) {
    envVars[`process.env.${key}`] = JSON.stringify(process.env[key]);
  }
}

export default defineConfig({
  source: {
    define: {
      ...envVars
    },
    publicDir: 'public',
  },
  server: {
    port: 3002,
  },
  plugins: [pluginReact()],
  html: {
    template: './public/index.html',
  },
});
