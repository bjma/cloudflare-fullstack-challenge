# :cloud: Cloudflare Workers Internship Application: Full-Stack
Complete code for Cloudflare's Full-Stack Internship Challenge. Check it out [here]( https://github.com/cloudflare-internship-2020/internship-application-fullstack)!

## What it does :wrench:  
Upon visiting the website, the Workers script `index.js` uses the Fetch API to redirect you to one of two websites in the style of A/B testing, each variant having roughly 50% chance of showing up upon refresh.

## Running the project :rocket: 
All content is in `index.js`.

There's two ways to actually check out the project:
### wrangler
We can run our Workers script using the `wrangler` CLI.

Install using `npm`:
``` bash
npm i @cloudflare/wrangler -g
```

Running project in test environment:
``` bash
wrangler dev
```

To view, go to `https://localhost/8787`.

### Cloudflare subdomain
Alternatively, you can view the project [here](https://internship-application-fullstack.bjma.workers.dev/) on my Cloudflare subdomain.
