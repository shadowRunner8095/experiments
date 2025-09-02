import type { StorybookConfig } from 'storybook-react-rsbuild';

const config: StorybookConfig = {
  previewHead: ()=>{
    return `<base href="/experiments/with-router/storybook/">`
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