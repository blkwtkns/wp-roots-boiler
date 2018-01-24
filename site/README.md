# Example Theme Starter

Use this repo as a starting point for your next custom WordPress theme.

## Tech Stack

### Client

- [jQuery](https://jquery.com/) - Get off my lawn!
- [Lodash](https://lodash.com/) - Little utilities like throttle/debounce
- [Postal](https://github.com/postaljs/postal.js) - pub/sub library to allow decoupled communication between components
- [Modernizr](https://modernizr.com) - Browser feature detection (touch-events)

### Development

- [Gulp](http://gulpjs.com/) - Efficient, configurable, streaming task runner
- [Gulp File Include](https://github.com/coderhaoxin/gulp-file-include) - Basic HTML templating/includes.
- [BrowserSync](https://www.browsersync.io/) - Live reload changes
- [Webpack 2.6](https://webpack.github.io) - Automatic common module chunk bundling and tree shaking
- [Babel](https://babeljs.io/) - Use the latest ECMAScript features like all the cool kids
- [Sass](http://sass-lang.com/) - Easier CSS dev with variables, nesting, partials, import, mixins, inheritance, and operators
- [PostCSS](http://postcss.org/) - Autoprefix CSS
- [ESLint](http://eslint.org/) - Catch syntax and style issues

### CMS

- [Wordpress](https://wordpress.org/) - The web's most popular CMS
- [Bedrock](https://roots.io/bedrock/) - Improved WordPress boilerplate
  - Using Composer to manage all dependencies, including WordPress
  - Easier environment-specific configuration
  - Separate WP core files from our site files
- [WP Sync DB](https://github.com/wp-sync-db/wp-sync-db) - Push and pull database tables between WordPress installations
- [WP Sync DB Media Files](https://github.com/wp-sync-db/wp-sync-db-media-files) - Sync media libraries between WordPress installations
- [wp-cli](https://wp-cli.org//) - Command line interface for WordPress (for host)
- [Advanced Custom Fields](https://www.advancedcustomfields.com/)

## To Do

- [ ] Adjust Gulp to only update changed files
- [ ] Fix SASS sourcemaps
- [ ] BrowserSync
- [ ] Add better example site starting point
- [ ] PHP templating language?

## Get Started

1. Install [Node v6.9+](https://nodejs.org/en/) globally if you don't have it already
1. Install [Yarn](https://yarnpkg.com/) globally if you don't have it already
1. Using terminal change directories to the project root `cd /path/to/your-project/site`
1. Install dependencies by running `yarn`
1. Run any of the available commands found below

## Commands

| Command | Description |
|---------|-------------|
| `yarn` | Install dependencies |
| `yarn dev` | - Build WP database, then begin Transpile CSS and Javascript and move static files to the `site/web/app/themes/dist` folder |
| `yarn build` | Use Gulp to build static output to the `site/web/app/themes/dist` folder |
| `yarn lint` | Lint code using ESLint |
| `yarn build-db` | Build WordPress database from backup or sync from existing |
| `yarn build-all` | Build WordPress database, sync, then build static output with gulp |

## Project Structure

- **config** - WordPress configuration files
  - **environments** - Environment specific configs
  - `application.php` - Primary WP config file (wp-config.php equivalent)
- **node_modules** - Node packages (never edit)
- **src** - Custom theme development files to be transpiled/copied into `site/web/app/themes/dist`. Directories with an asterisk "*" will NOT be copied over.
  - **data** - Custom data in JSON files to be used in templates and javascript
  - **fonts**
  - **images**
  - **template-parts** - PHP partials
    - **common** - Global elements
    - **svgs** - SVGs that will inlined by including them as partials
  - **scripts*** - Scripts will be transpiled with Webpack to `site/web/app/themes/dist/js`. See `webpack.config.js` for more details
    - **components** - javascript class files grouped by the areas of the application that they are used
    - **constants** - Constants groups into files by type (ActionTypes.js, NotificationTypes.js, etc..)
    - **services** - Stand-alone JavaScript modules (non-class components)
    - `scripts.js` - File is the entrypoint for webpack and will be built to `site/web/app/themes/dist/scripts.js`
  - **styles*** - Sass files transpiled to `dist/css`
  - `footer.php`
  - `functions.php` - Customize WP parameters for this theme
  - `header.php`
  - `index.php` - Home page template
  - `page.php` - Default page template
  - `*.php` - Other page templates
- **vendor** - Composer packages (never edit)
- **web** - Web root (vhost document root)
  - **app** - wp-content equivalent
    - **mu-plugins** - Must use plugins
    - **plugins** - General Plugins
    - **themes** - Themes
    - **uploads** - Uploads
  - **wp** - WordPress core (never edit)
  - `index.php` - WordPress view bootstrapper
  - `wp-config.php` - Required by WP (never edit)
- .env - Automatically configured by Trellis
- `composer.json` - Manage versions of WordPress, plugins & dependencies
- `wp-cli.yml` - WP-CLI variables
- `scripts/` - Shell scripts for db syncing
- `dotfiles` - Various configs for the different parts of the stack


## Development Workflow

### Static files

For files and folders that are completely static and don't need to go through the asset pipeline, put them in
the `src` directory and they will be directly copied over to the `site/web/app/themes/dist` directory.

### PHP

#### Partials

#### SVGs

SVGs are stored in the `src/template-parts/svgs` directory

```php
// from root .php file
<?php include("svgs/kiwi.svg"); ?>

// from /template-parts/sub-directory/*.php
<?php include(__DIR__ ."/../svgs/kiwi.svg"); ?>
```

### Javascript

You can use ES6 and use both relative imports or import libraries from npm.

### Modernizr

```javascript
if (Modernizr.touchevents) {
	console.log('touch events');
} else {
	console.log('no touch events');
}
```

### Postal

```javascript
import postal from 'postal';
import { HOME } from '../constants/Channels';

const channel = postal.channel(HOME);

channel.subscribe('some.event', (args) => {
	console.log('some.event called');
	console.log('args', args);
});

channel.publish('some.event', {
	foo: true,
	bar: false
});

```

### CSS

Any SCSS file directly under the `src/styles/` folder will get compiled with [PostCSS Next](http://cssnext.io/)
to `site/web/app/themes/dist/css/{filename}.css`.







