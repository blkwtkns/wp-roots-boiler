# Development Workflow

How to create custom site/theme.

This assumes you have already followed the instructions in [Get Started](get_started.md).

- [Start local dev environment](#start-local-dev-environment)
- [Theme Development](#theme-development)
- [Plugins](#plugins)
- [Updating](#updating)

## Start local dev environment

From inside the `trellis` directory run the command `vagrant up`.

You should then be able to see the site at the dev url you configured in the `trellis/group_vars/development/wordpress_sites.yml` file.

You can login to the WordPress dashboard by going to `<your-dev-url>/wp/wp-admin`. Please note the addition `wp` directory which keeps the core WordPress files separate from the rest of our app.

The username is the email you added to `trellis/group_vars/development/wordpress_sites.yml` and the password is what you set in the `trellis/group_vars/development/vault.yml` file.

## Synchronize with dev/stage/prod

How to synchronize everything between dev, staging, and production environments.

[Syncing Dev, Staging, and Production](syncing_dev_staging_production.md)

## Theme development

Custom theme development takes place inside the `site` directory.

More info to come.

## Plugins

Plugins are all managed using [Composer](http://getcomposer.org/).

[WordPress Packagist](http://wpackagist.org/) is already registered in the `composer.json` file so any plugins from the [WordPress Plugin Directory](http://wordpress.org/plugins/) can easily be required.

Check out [this blog post](https://roots.io/using-composer-with-wordpress/) for more info.

### How to add a plugin

To add a plugin, add it under the `require` directive in `site/composer.json` or use `composer require <namespace>/<packagename>:<version>` from the command line inside the `site` directory. If it's from WordPress Packagist then the namespace is always `wpackagist-plugin`. The version is not always required.

Example: `"wpackagist-plugin/akismet": "dev-trunk"` in the `composer.json` or `composer require wpackagist-plugin/akismet:dev-trunk` from the command line

Whenever you add a new plugin or update the WP version, run `composer install && composer update` from inside the `site` directory to install your new packages.

The `plugins` directory is tracked by Git so you can add plugins that are not available to be installed by Composer if you really need to, but using Composer is highly recommended so you can easily track dependencies and their versions.

Note: You will still have to login to the WP Admin and activate the plugin.

Note: Some plugins may create files or folders outside of their given scope, or even make modifications to `wp-config.php` and other files in the `app` directory. These files should be added to your `.gitignore` file as they are managed by the plugins themselves, which are managed via Composer. Any modifications to `wp-config.php` that are needed should be moved into `config/application.php`.


## Updating

### How to update a plugin

Updating a plugin is just a matter of changing the version number in the `composer.json` file.

Then running `composer update` will pull down the new version.

### How to update WordPress

Updating your WordPress version is just a matter of changing the version number in the `composer.json` file.

Then running `composer update` will pull down the new version.

### How to update Trellis

Trellis is installed as a [git subtree](http://chrisknightindustries.com/2015/24/11/git-subtrees-for-trellis-workflow.html). To update the subtree you need to checkout the corresponding branch and pull/ merge. To avoid merging the histories use the --squash command.

From inside the root project directory run the following commands.

```
$ git checkout trellis
$ git pull
$ git checkout master
$ git merge -X subtree=trellis/ --squash trellis/master --allow-unrelated-histories
$ git commit -m "Update trellis from trellis/master"
```

You will most likely get some merge conflicts with the files you have edited/customized which you will have to resolve.

# How to deploy changes

Once you have made your changes to plugins, content, theme, etc...  move onto the [deployment workflow](deployment_workflow.md) to deploy them to staging/production.

