

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
- [x] Add documentation
- [ ] Make code more readable (mainly fingerprint_proxy.js)
- [ ] Add tests
- [ ] Test integration against mock warden
  - [ ] Fix browser cache request caching
- [ ] Unify build process (
  - [ ] use build.sh inside Dockerfile
  - [ ] define env variable fallbacks in one common place that works locally, in docker-compose.yml, build.sh, everywhere)

# Documentation

Fingerprint NGINX Proxy Integration is responsible for proxying identification and agent-download requests between your website and Fingerprint through your Fastly infrastructure. The integration consists of a reusable piece of NGINX configuration. You can include it in your existing NGINX configuration or deploy as Docker image anywhere you want. The NGINX template is available on [GitHub](https://github.com/fingerprintjs/fingerprint-pro-nginx-proxy-integration).



> [!WARNING]  
> #### Integration in Beta
> This integration is in Beta. If you encounter any issues, please [open an issue](https://github.com/fingerprintjs/fingerprint-pro-nginx-proxy-integration/issues) on GitHub or contact our [support](https://fingerprint.com/support).
>
> #### Limited to Enterprise plan
> 
> The NGINX Proxy Integration is supported only for customers on the **Enterprise** Plan.  Other customers are encouraged to use [Custom subdomain setup](https://dev.fingerprint.com/docs/custom-subdomain-setup) or [Cloudflare Proxy Integration](https://dev.fingerprint.com/docs/cloudflare-integration).
> 
> #### Manual updates occasionally required
> 
> The underlying data contract in the identification logic can change to keep up with browser and device releases. Using the NGINX Proxy Integration might require occasional manual updates on your side. Ignoring these updates will lead to lower accuracy or service disruption.


<a href="https://cloud.digitalocean.com/apps/new?repo=https://github.com/Orkuncakilkaya/fingerprint-nginx/tree/main">
 <img src="https://www.deploytodo.com/do-btn-blue.svg" alt="Deploy to DO">
</a>


## The benefits of using the NGINX Proxy Integration

- Significant increase in accuracy in browsers with strict privacy features, such as Safari or Firefox.
- Cookies are now recognized as “first-party.” This means they can live longer in the browser and extend the lifetime of visitor IDs.
- Ad blockers will not block our Fingerprint JavaScript agent from loading. Attempts to connect to an external URL will be stopped by most ad blockers, but attempts to connect to the same site URL will be allowed.
- Ad blockers will not block our identification requests since they are sent to the specific path or subdomain that belongs to the same site.
- Insight and control over the identification requests that can be combined with other NGINX features like logging and monitoring.
- Cookie security: Fastly VCL Proxy Integration drops all the cookies sent from the origin website. The code is open-source, so this behavior can be transparently verified and audited.
- Easy to meet compliance and auditing requirements.

## Integration setup overview

The integration setup consists of the following three steps. Each step is described in detail below.

1. Issue a proxy secret in the Fingerprint dashboard.
2. Create integration path variables.
3. Add the proxy NGINX configuration to your existing NGINX configuration or deploy it separately as a Docker image.
4. Configure the Fingerprint JavaScript agent on your website or mobile app.


## Step 1: Create a Fingerprint proxy secret

Issue a Fingerprint proxy secret to authenticate requests from your NGINX server.

1. Go to the [Fingerprint dashboard](https://dashboard.fingerprint.com) and select your workspace.
2. In the left menu, navigate to [**API keys**](https://dashboard.fingerprint.com/api-keys).
3. Click **Create Proxy Key**.
4. Give it a name, for example, `NGINX proxy integration`.
5. Click **Create API Key**.

You will use the proxy secret value in the following step, so store it somewhere safe.

## Step 2: Create path variables

You need to set the path variables you will use throughout your NGINX configuration and the JavaScript agent configuration on your website ([Step 4](#step-4-configure-the-fingerprint-javascript-agent-on-your-client)). These values are arbitrary. Just decide what your values are and write them down somewhere. 

In this guide, we will use readable values corresponding to the variable names to make it easier to follow:  

```
FPJS_AGENT_DOWNLOAD_PATH="FPJS_AGENT_DOWNLOAD_PATH"
GET_RESULT_PATH="GET_RESULT_PATH"
```

However, your values used in production should look more like random strings: 

```
FPJS_AGENT_DOWNLOAD_PATH="vbcnkxb654"
FPJS_GET_RESULT_PATH="5yt489hgfj"
```

That is because some ad blockers might automatically block requests from any URL containing fingerprint-related terms like "fingerprint", "fpjs", "track", etc. Random strings are the safest. So whenever you see a value like `FPJS_GET_RESULT_PATH` in this guide, you should use your random value instead.

In the following step, you can choose between two options:

- Option A: Deploy the NGINX configuration as a Docker image
- Option B: Add the NGINX configuration to your existing NGINX configuration

## Step 3 (Option A): Deploy the NGINX configuration as a Docker image

You can deploy the NGINX configuration as a Docker image to any Docker-compatible environment. In this example, we will deploy it to Digital Ocean, but the process is similar for Hetzner, Google Cloud Run and other providers.

1. Click the Deploy to DO button below.

<a href="https://cloud.digitalocean.com/apps/new?repo=https://github.com/Orkuncakilkaya/fingerprint-nginx/tree/main">
 <img src="https://www.deploytodo.com/do-btn-blue.svg" alt="Deploy to DO">
</a>

2. Optional: Configure the resources of your instance according to your needs.
3. Click **Next**.
4. Under `fingerprint-nginx` environment variables, click **Edit**.
5. Set `FPJS_AGENT_DOWNLOAD_PATH` and `FPJS_GET_RESULT_PATH` to the values you created in [Step 2](#step-2-create-path-variables).
6. Set `FPJS_PROXY_SECRET` to the value you created in [Step 1](#step-1-create-a-fingerprint-proxy-secret).
7. If you platform uses a special header for forwarding the client IP address, set `FPJS_PLATFORM_IP_HEADER_NAME` to the name of the header. For Digital Ocean, this is `$http_do_connecting_ip`.
8. Optionally configure other variables for demo and debugging purposes. Setting `FPJS_PUBLIC_API_KEY` and `FPJS_REGION` lets you see the demo of the integration and the `/` base path.
9. Click **Save**.
10. Click **Next**, **Next** and finally **Create resources**.
11. Wait for the deployment to finish.
12. Click **Live App**.

## Step 3 (Option B): Add the NGINX configuration to your existing NGINX configuration

You can can add the proxy NGINX configuration to your existing NGINX configuration running locally or on your server. 

1. Open the console in the environment where your NGINX is running.
2. Clone this repository by running `git clone https://github.com/fingerprintjs/fingerprint-pro-nginx-proxy-integration.git`.
3. Create your own `.env` file by copying the `.env.example` file: `cp .env.example .env`.
4. Replace the placeholder values in the `.env` file with your own values: 
   1. Set `FPJS_AGENT_DOWNLOAD_PATH` and `FPJS_GET_RESULT_PATH` to the values you created in [Step 2](#step-2-create-path-variables).
   2. Set `FPJS_PROXY_SECRET` to the value you created in [Step 1](#step-1-create-a-fingerprint-proxy-secret).
   3. Optionally configure other variables for demo and debugging purposes. Setting `FPJS_PUBLIC_API_KEY` and `FPJS_REGION` lets you see the demo of the integration and the `/` base path.
5. Run `./build.sh` to generate the NGINX configuration files. The files will be saved to the `build` directory.
6. Copy the `build/fingerprint_proxy.conf` and `build/fingerprint_proxy.js` to your existing NGINX configuration folder.
7. Include the `build/fingerprint_proxy.conf` in your existing NGINX configuration, inside the `server` block.

    ```diff
    http {
        server {
            listen 80;

    +        # Include Fingerprint proxy integration directives
    +        include /etc/nginx/fingerprint_proxy.conf;
        }
    }
    ```
8. The integration relies the the NGINX JavaScript module. If you NGINX server is not already using NJS: 
   1. [Install the module](https://nginx.org/en/docs/njs/install.html) by running `sudo apt-get install nginx-module-njs`.
   2. Add the `load_module "nginx-module-njs.so";` directive to the top of the `nginx.conf` file.

    ```diff
    + load_module modules/ngx_http_js_module.so;

    events {}
    http {
        server {
            # ...
            # Fingerprint Proxy: Include proxy integration directives
            include /etc/nginx/fingerprint_proxy.conf;
        }
    }
    ```

9. Restart NGINX to apply the changes: `sudo nginx -s reload`.

## Step 4: Configure the Fingerprint JavaScript agent on your client

Use the path variables created in [Step 2](#step-2-create-path-variables) to construct the script download and identification endpoint URLs.

Configure the Fingerprint JS Agent on your website accordingly:

### NPM Package

```js
import * as FingerprintJS from '@fingerprintjs/fingerprintjs-pro'

// Initialize the agent at application startup.
const fpPromise = FingerprintJS.load({
  apiKey: 'PUBLIC_API_KEY',
  scriptUrlPattern: [
    'https://yourwebsite.com/FPJS_AGENT_DOWNLOAD_PATH?apiKey=<apiKey>&version=<version>&loaderVersion=<loaderVersion>',
    FingerprintJS.defaultScriptUrlPattern, // Fallback to default CDN in case of error
  ],
  endpoint: [
    'https://yourwebsite.com/FPJS_GET_RESULT_PATH?region=us',
    FingerprintJS.defaultEndpoint // Fallback to default endpoint in case of error
  ],
});
```

### CDN

```js
const url = 'https://yourwebsite.com/FPJS_AGENT_DOWNLOAD_PATH?apiKey=<PUBLIC_API_KEY>';
const fpPromise = import(url)
  .then(FingerprintJS => FingerprintJS.load({
    endpoint: [
      'https://yourwebsite.com/FPJS_GET_RESULT_PATH',
      FingerprintJS.defaultEndpoint // Fallback to default endpoint in case of error
    ]
  }));
```


> ### Parameter URL nuances 📘 
> 
> Note that the import `url` for the CDN installation method and `scriptUrlPattern` used by NPM packages are similar but different and **cannot be used interchangeably**.
> Pay attention to differences in query parameters:
>   - **Pass region** to the `endpoint` parameters in the following format: `?region=eu`. The value needs to reflect the [region](https://dev.fingerprint.com/docs/regions) of you application.
>   - **Leave the `scriptUrlParam` parameter as displayed here:** `?apiKey=<apiKey>&version=<version>&loaderVersion=<loaderVersion>`. The `apiKey` `version` and `loaderVersion` parameters will be replaced by the values in the NPM package automatically. Do not alter them manually.


## Monitoring and troubleshooting the integration

Use your existing NGINX monitoring and logging tools to monitor and troubleshoot the integration. If you encounter any issues, please [open an issue](https://github.com/fingerprintjs/fingerprint-pro-nginx-proxy-integration/issues) on GitHub or contact our [support](https://fingerprint.com/support).

TBD: Dashboard status page. 
