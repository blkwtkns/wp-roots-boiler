# Deployment Workflow

How to deploy changes to staging/production.

## Commit and push your changes to GitHub


## Deploy changes to remote server

To deploy the updated files run the following command from inside the `trellis` directory. Where `<domain>` is the site url you added to the `<environment>/wordpress_sites.yml` file in Step 2.2.

```
./bin/deploy.sh <environment> <domain>
```

`deploy.sh` is a very simple Bash script which just runs the actual command: `ansible-playbook deploy.yml -e "site=<domain> env=<environment>"`. You can always use this command itself if you need to use any additional `ansible-playbook` options.

### Mac

As a Mac user if you get the error, but everything was working previously.

```
Git repo <your-github-repo> cannot be accessed. Please verify the repository exists and you have SSH forwarding set up correctly
```

It means that the OS "forgot" your key and you will need to add it again with the following command.

```
ssh-add -K ~/.ssh/id_rsa

<same can happen in linux, use the same command as above, but use a lowercase 'k'>
```
