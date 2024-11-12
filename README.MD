# Fingerprint Pro NGINX Proxy integration

The goal of this project is create and NGINX integration for Fingerprint that will proxy requests between your client agent and Fingerprint CDN and API.
We will be using the [Custom proxy integration guidelines](https://dev.fingerprint.com/docs/custom-proxy-integrations) and translating them into an NGINX configuration.

## Development

To run the project, use `docker compose up --build -d`. Run after every file change to see your changes.

## To-do

- [x] Proxy the agent download request
- [x] Proxy the identification request
- [x] Proxy the browser cache request
- [ ] Allow user to customize paths and proxy secret
- [ ] Package it as a module (or something) that you can easily add to your existing NGINX setup
- [ ] Package it as a Docker image you can easily deploy anywhere
- [ ] Add documentation
- [ ] Add tests
- [ ] Test integration against mock warden

