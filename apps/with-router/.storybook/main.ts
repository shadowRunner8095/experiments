import type { StorybookConfig } from 'storybook-react-rsbuild';



const config: StorybookConfig = {
  rsbuildFinal: (config) => {
    if(process.env.NODE_ENV !== 'production')
      return config;
    config.output ??= {};
    config.output.assetPrefix = '/experiments/with-router/storybook/'; // adjust to your deployment path
    return config;
  },
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-docs",
    "@storybook/addon-onboarding"
  ],
  "framework": {
    "name": "storybook-react-rsbuild",
    "options": {}
  }
};
export default config;