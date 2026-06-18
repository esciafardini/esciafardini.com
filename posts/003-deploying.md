Here, I will document how this website went from running locally to something accessible across the WORLD WIDE WEB...

# BEHOLD THESE STEPS

## Specifications
- Static webpage (no database)
- All javascript dependencies load from external URLs (no npm needed)
- Github pages for deployment (free, simple)
- Utilize custom domain name `esciafardini.com` (registered via cloudflare)
- Need to render markdown files via fetch()
  - Required local HTTP server to make this work in dev
  - Does this come for free with Github Pages?

## The Domain Name
I use cloudflare for purchasing domain names - it's nice because they don't bait & switch you with a higher price after a year of use ☻

## Enabling Github Pages
I know it's futile to even document the steps here, but this is what *really* happened!!!!

1. Set up a Github repo & push the latest code
2. Go to settings in Github Repo → then Pages
3. Set the main branch for deployments

Shockingly, the page just seems to work here: 
[OMG Github!!!](https://esciafardini.github.io/esciafardini.com/)

Wow. Simple. Incredible. Okay.

Now to redirect traffic to my registered domain to the github page.

4. Adding a custom domain name to Github Pages?

I noted a warning on github:
```markdown
Make sure you add your custom domain to your GitHub Pages site 
BEFORE configuring your custom domain with your DNS provider. 
```

Sure - but when I added my custom URL to Github Pages...

Right away, I am getting an error message:

![ERROR](posts/images/003-github-error.png)

This did however add a CNAME to the github directory. What does it all mean?

Seems like GitHub ran a DNS check & didn't find anything. It did however make a CNAME in the directory. Interesting...

5. Consulting these docs: 
[Managing A Custom Domain for Github Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) 
(wouldn't be surprised if this link doesn't work in two months - but oh well)

Ok....so it looks like I have to set up these A and CNAME records first?

The link above tells me which A addresses to add to my cloudflare account I suppose...

Also need a www CNAME for the website...

6. Setting A and CNAME records in cloudflare

In an attempt to resolve this issue, I added the A records along with a CNAME record:

![cloudflare DNS](posts/images/003-cloudflare-dns-settings.png)

Each DNS record is set to "DNS Only" (not Proxy). This means our domain points to Github.

And suddenly - github has deployed my webpage to esciafardini.com

![SUCCESS](posts/images/003-github-success.png)

I think I did things in the right order?

Recall github's warning:
```markdown
Make sure you add your custom domain to your GitHub Pages site 
BEFORE configuring your custom domain with your DNS provider. 
```

I did this. It created a CNAME in the repo but failed. The domain was claimed, but now DNS records were configured in cloudflare. I added the CNAME and A records (per the documentation) and then everything just worked.

So for now, I suppose I will have to wait for the TLS certificate to be provisioned....

In the meantime, the website works! (just not via https)

☻ ☻ ☻ ☻ ☻ ☻ ☻ ☻

*Update: after about 5 minutes, TLS cert was provisioned. I was able to enable HTTPS - and so this webpage is accessible via HTTPS!*

## Questions, Answers (soon)

1. What is a DNS record?

2. What does @ mean when setting a DNS record?

3. What do A and CNAME specify?

4. Why are we using DNS-only instead of Poxy in cloudflare?

5. What is TLS certificat provisioning?

6. What is Github doing when it does it's DNS check?

7. Why does serving markdown files "just work" via Github Pages?
