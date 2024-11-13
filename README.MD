<a href="https://cloud.digitalocean.com/apps/new?repo=https://github.com/Orkuncakilkaya/fingerprint-nginx/tree/main">
 <img src="https://www.deploytodo.com/do-btn-blue.svg" alt="Deploy to DO">
</a>

# Fingerprint Pro NGINX Proxy integration

The goal of this project is create and NGINX integration for Fingerprint that will proxy requests between your client agent and Fingerprint CDN and API.
We will be using the [Custom proxy integration guidelines](https://dev.fingerprint.com/docs/custom-proxy-integrations) and translating them into an NGINX configuration.

## Development

To run the project, use `docker compose up --build -d`. Run after every file change to see your changes.

## To-do

- [x] Proxy the agent download request
- [x] Proxy the identification request
- [x] Proxy the browser cache request
- [x] Allow user to customize paths and proxy secret
- [x] Package it as a module (or something) that you can easily add to your existing NGINX setup
- [x] Package it as a Docker image you can easily deploy anywhere
- [ ] Add documentation
- [ ] Make code more readable (mainly fingerprint_proxy.js)
- [ ] Add tests
- [ ] Test integration against mock warden
  - [ ] Fix browser cache request caching
- [ ] Unify build process (
  - [ ] use build.sh inside Dockerfile
  - [ ] define env variable fallbacks in one common place that works locally, in docker-compose.yml, build.sh, everywhere)

