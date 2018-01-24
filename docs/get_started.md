# Get Started

How to configure everything for local development.

## 1. Install Local Dependencies

1. [Virtualbox](https://www.virtualbox.org/wiki/Downloads) >= 4.3.10
1. [Vagrant](https://www.vagrantup.com/downloads.html) >= 1.8.5
1. [vagrant-bindfs](https://github.com/gael-ian/vagrant-bindfs#installation) >= 0.3.1 (Windows users may skip this if not using vagrant-winnfsd for folder sync)
1. [vagrant-hostmanager](https://github.com/smdahlen/vagrant-hostmanager#installation)
1. [vagrant-triggers](https://github.com/emyl/vagrant-triggers)
1. [Ansible](http://docs.ansible.com/ansible/intro_installation.html#latest-releases-via-pip) >= 2.4 ([except for Windows users](https://roots.io/trellis/docs/windows/))
1. Ansible Galaxy roles: run `ansible-galaxy install -r requirements.yml` in your local trellis directory
1. [WordPress Command Line](http://wp-cli.org/#installing)

## 2. Configure Site

**Skip this step if you are joining an existing project and this has already been done**

Update `trellis/group_vars/development/wordpress_sites.yml`.

**Note:** The site name doesn't have to be the domain; it's just a name space so you can configure multiple sites in the same file. The site name should be consistent across all `trellis/group_var/*` files.The `site_hosts` is your actual url.

```diff
wordpress_sites:
+ example.com: # replace with site name
    site_hosts:
+     - canonical: example.test # replace with development url you want
        # redirects:
        #  - www.example.test
    local_path: ../site # path targeting local Bedrock site directory (relative to Ansible root)
+   admin_email: admin@example.test # change to your email
    multisite:
      enabled: false
    ssl:
      enabled: false
      provider: self-signed
    cache:
      enabled: false
```

Update `trellis/group_vars/development/vault.yml`.

```diff
# Documentation: https://roots.io/trellis/docs/vault/
+vault_mysql_root_password: devpw # unique password

# Variables to accompany `group_vars/development/wordpress_sites.yml`
# Note: the site name (`example.com`) must match up with the site name in the above file.
vault_wordpress_sites:
+ example.com: # replace with site name
+   admin_password: admin # unique password
    env:
+     db_password: example_dbpassword # unique password
```

[See docs for additional options](https://roots.io/trellis/docs/wordpress-sites/)


## 3. Start a Local Instance of the WordPress Site Using Vagrant

From inside the `trellis` directory run the command `vagrant up`.

This will create a virtual machine running your WordPress site based on the `Vagrantfile` in our `trellis` directory which uses Ansible provisioner to run the `dev.yml` playbook.

The first time you run this, it’ll take a 5–10 minutes. This is because Vagrant needs to download and configure all the pieces required to get the box up and running properly. After the first time, a lot of dependencies will be cached, which makes things much quicker for subsequent calls to `vagrant up`.

## 4. View the site locally

You should then be able to see the site at the dev url you configured in the `wordpress_sites.yml` file.

## 5. Activate WordPress Plugins

Login to the WordPress dashboard by going to `<your-dev-url>/wp/wp-admin`. Please note the addition `wp` directory which keeps the core WordPress files separate from the rest of our app.

The username is the email you added to `wordpress_sites.yml` and the password is what you set in the `vault.yml` file.

Go to the Plugins section and activate all the plugins.

## 5. Sync WordPress data

If you need to sync your local environment's content with staging or production check out [Syncing Dev, Staging, and Production](syncing_dev_staging_production.md).
