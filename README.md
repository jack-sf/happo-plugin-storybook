# happo-plugin-storybook

A [happo.io](https://github.com/enduire/happo.io) plugin for Storybook. See https://medium.com/happo-io/cross-browser-screenshot-testing-with-happo-io-and-storybook-bfb0b848a97a for a lengthier introduction to this plugin.

## Usage

Add the following to your `.happo.js` configuration file:

```js
// .happo.js
const happoPluginStorybook = require('happo-plugin-storybook');

module.exports = {
  // ...
  plugins: [
    happoPluginStorybook({
      // options go here
    }),
  ],
}
```

Add this to `.storybook/config.js`:

```js
// .storybook/config.js

import 'happo-plugin-storybook/register';
```

## `happoPluginStorybook` options

- `configDir` specify the name of the Storybook configuration directory. The
  default is `.storybook`.
- `outputDir` the name of the directory where compiled files are saved. The
  default is '.out'.
- `staticDir` directory where to load static files from, comma-separated list.

These options are the same ones used for the `build-storybook` CLI command. See
https://storybook.js.org/configurations/cli-options/#for-build-storybook


## `happo-plugin-storybook/register` tricks

If you want to have better control over what addons and/or decorators get
loaded you can make use of the `isHappoRun` function exported by
`happo-plugin-storybook/register`:

```js
// .storybook/config.js
import { isHappoRun } from 'happo-plugin-storybook/register';

if (!isHappoRun()) {
  // load some addons/decorators that happo won't use
} else {
  // load some addons/decorators that happo will use
}
```

Happo will make its best to wait for your stories to render, but at times you
might need a little more control in the form of delays. There are two ways to
set delays: one global and one per story. Here's an example of setting a global
delay:

```js
import { setDefaultDelay } from 'happo-plugin-storybook';

setDefaultDelay(100); // in milliseconds
```

Here's how you set an individual delay:

```js
storiesOf('FooComponent', module)
  .add('delayed', () => <FooComponent />, { happo: { delay: 200 } });
```



