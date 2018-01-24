# Remote Server Setup

How to setup remote server for staging/production.

## 1. Create a remote server

You need a have a private server or virtual private server (AWS, Digital Ocean, etc..) running a bar/stock version of Ubuntu 16.04 Xenial.

**You can't run trellis on a shared host** because you need to be able to connect to your server from your local computer via SSH.

### Digital Ocean

For Digital Ocean create a new droplet and choose Ubuntu 16.04 x64 for the distribution, $5/mo for the size, choose any datacenter region, and **include your SSH key**.

Confirm that you can SSH into the server

```
ssh root@<server-ip-address>
```


**Revised:** There seems to be an authentication issue if developer's ssh-agent isn't started and aware of developer's key. The agent by default doesn't start on boot, so if coming from a reboot, cold start, or just starting the project, do the following ([reference](https://stackoverflow.com/questions/17846529/could-not-open-a-connection-to-your-authentication-agent)):

```
ssh-add -l
<if you see message 'Could not open a connection to your authentication agent.' continue with directions.>

eval $(ssh-agent)

<if MacOS/OSX>
ssh-add -K path/to/.ssh/id_rsa

<Linux>
ssh-add -k path/to/.ssh/id_rsa

<enter passphrase if prompted>
```


**Note:** ( NB: This step shouldn't be necessary if prior code snippet worked correctly. ) If you get an error about `Incorrect sudo password` you will need to add  an `admin` user ([reference](https://discourse.roots.io/t/sudoer-password-to-set-up-remote-server/5995)).

```
# adduser admin --ingroup sudo
<Add password (remember for Step 2.4)>
<Leave user info blank>

# gpasswd -a admin sudo
# su - admin
$ mkdir .ssh
$ chmod 700 .ssh
$ nano .ssh/authorized_keys
<paste id_rsa.pub inside>
<control+0 the hit enter to write file>
<control+X to exit>

$ chmod 600 .ssh/authorized_keys
$ exit
# service ssh restart
<control+D to disconnect from server>
```

You will need to clear the old host key from your `known_hosts` by running `ssh-keygen -R <server-ip-address>` so you don't run into errors later when you go to deploy files to the server.

## 2. Configure Trellis

### 2.1. Tell Trellis where the remote server is

Update the `trellis/hosts/<environment>` file.

```diff
[production]
+ your_server_hostname # replace with IP address of remote server

[web]
+ your_server_hostname # replace with IP address of remote server
```

### 2.2. Configure site

Update the `trellis/group_vars/<environment>/wordpress_sites.yml` file.

**Note:** The site name doesn't have to be the domain; it's just a name space so you can configure multiple sites in the same file. The site name should be consistent across all `trellis/group_var/*` files.The `site_hosts` is your actual url.

```diff
wordpress_sites:
+ example.com: # replace with your site name
    site_hosts:
+     - canonical: example.com # replace with your site url (you should have DNS access to setup this domain for your private server)
        # redirects:
        #  - www.example.com
    local_path: ../site # path targeting local Bedrock site directory (relative to Ansible root)
+   repo: git@github.com:example/example.com.git # replace with your Git repo URL
    repo_subtree_path: site # relative path to your Bedrock/WP directory in your repo
    branch: master
    multisite:
      enabled: false
    ssl:
      enabled: false
      provider: letsencrypt
    cache:
      enabled: false
```

[See docs for additional options like SSL and caching](https://roots.io/trellis/docs/wordpress-sites/#remote-servers)

### 2.3. Configure Mail

Update the `trellis/group_vars/<environment>/mail.yml` file.

[See docs for all the options](https://roots.io/trellis/docs/mail/)

### 2.4. Add GitHub Keys

Update `trellis/group_vars/all/users.yml`. You can add multiple GitHub users

```diff
admin_user: admin

users:
  - name: "{{ web_user }}"
    groups:
      - "{{ web_group }}"
    keys:
      - "{{ lookup('file', '~/.ssh/id_rsa.pub') }}"
+     # - https://github.com/username.keys # un-comment and add your GitHub username
  - name: "{{ admin_user }}"
    groups:
      - sudo
    keys:
      - "{{ lookup('file', '~/.ssh/id_rsa.pub') }}"
+     # - https://github.com/username.keys # un-comment and add your GitHub username

web_user: web
web_group: www-data
web_sudoers:
  - "/usr/sbin/service php7.1-fpm *"
```

Confirm you can SSH into GitHub

```
ssh -T git@github.com
```

### 2.5. Add security settings

Open the `trellis/group_vars/<environment>/vault.yml`.

**Note:** The site name doesn't have to be the domain; it's just a name space so you can configure multiple sites in the same file. The site name should be consistent across all `trellis/group_var/*` files.

```diff
# Documentation: https://roots.io/trellis/docs/vault/
+vault_mysql_root_password: productionpw

# Documentation: https://roots.io/trellis/docs/security/
vault_users:
  - name: "{{ admin_user }}"
+   password: example_password # The `admin` user password you set up on the remote server in Step 1
+   salt: "generateme"

# Variables to accompany `group_vars/production/wordpress_sites.yml`
# Note: the site name (`example.com`) must match up with the site name in the above file.
vault_wordpress_sites:
+ example.com: # Replace with site name
    env:
+     db_password: example_dbpassword
      # Generate your keys here: https://roots.io/salts.html
+     auth_key: "generateme"
+     secure_auth_key: "generateme"
+     logged_in_key: "generateme"
+     nonce_key: "generateme"
+     auth_salt: "generateme"
+     secure_auth_salt: "generateme"
+     logged_in_salt: "generateme"
+     nonce_salt: "generateme"
```

If setting up the production environment you will want to encrypt the `vault.yml` file using [Ansible Vault](https://roots.io/trellis/docs/vault/) so you are not committing plain text credentials to the repo.

## 3. Provision the remote server

Now that the proper configuration is in place, we need to let Trellis provision the production server by running Ansible which will run through a series of commands that will download, install, and configure the server.

From inside the `trellis` directory run the following command where `<environment>` is either `development` or `production`.

```
cd trellis
ansible-playbook server.yml -e env=<environment>
```

This will take about 5–10 minutes, after which you will have a properly configured server we can deploy the site to.

At this point we will have a properly configured server with PHP, Nginx, Database, etc... but it doesn't have our files on it.


## 4. Deploy files to remote server

**Make sure your latest changes have been committed and pushed to GitHub before you deploy.**

To deploy the site's files run the following command from inside the `trellis` directory. Where `<site-name>` is the site name you added to the `<environment>/wordpress_sites.yml` file in Step 2.2.

```
cd trellis
./bin/deploy.sh <environment> <site-name>
```

`deploy.sh` is a very simple Bash script which just runs the actual command: `ansible-playbook deploy.yml -e "site=<domain> env=<environment>"`. You can always use this command itself if you need to use any additional `ansible-playbook` options.

This will clone our repo and download our files to the remote server then install our composer dependencies (including WordPress).

**Note:** If you previously SSH'd into this server before provisioning it, deploying will fail with a warning that the `Remote Host Identification has Changed`. You will need to clear the old host key from your `known_hosts` by running `ssh-keygen -R <remote-ip-address>` the re-run the deploy command.

## 5. Install WordPress

View the site at the `canonical` url you added to the `wordpress_sites.yml` file in Step 2.2.

Trellis only manages files and does not automatically install WordPress on the remote server so you will just see the default WordPress install screen.

Run through the WordPress install instructions on the screen.

## 6. Activate WordPress Plugins

Login to the WordPress dashboard by going to `<your-dev-url>/wp/wp-admin`. Please note the addition `wp` directory which keeps the core WordPress files separate from the rest of our app.

The username is the email you added to `wordpress_sites.yml` and the password is what you set in the `vault.yml` file.

Go to the Plugins section and activate all the plugins.

## 7. Sync WordPress data

If you need to sync the remote server's content with your local environment or staging check out [Syncing Dev, Staging, and Production](syncing_dev_staging_production.md).
