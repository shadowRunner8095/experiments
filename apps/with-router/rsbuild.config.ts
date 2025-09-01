import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/rspack'

export default defineConfig(({command})=>{
  console.log({command})
  return ({
  output: {
    assetPrefix: command === 'build' ? '/experiments/with-router/': undefined,
  },
  plugins: [pluginReact()],
  tools: {
    rspack: {
      plugins: [
        tanstackRouter({
          target: 'react',
          autoCodeSplitting: true,
          routesDirectory: 'src/routes'
        }),
      ],
    },
  },
})});
