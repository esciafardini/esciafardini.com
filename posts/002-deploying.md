On the process of getting this page live on internet!

## Specifications

```markdown
"What is your website and what does it do?"
-Arnold Schwarzenegger
```
- Static webpage (no database)
- All javascript dependencies load from external URLs (no npm needed)
- Absolutely NO React.js (this is my safe space)
- Github pages for deployment (free, simple)
- Utilize custom domain name `esciafardini.com` (registered via Cloudflare)
- Need to render markdown files via fetch()
  - Required local HTTP server to make this work in dev
  - Does this come for free with Github Pages?

## Buying The Domain Name
I use Cloudflare for purchasing domain names because they don't bait & switch you with a higher price after one year of use.

## Steps To Getting This Page Live
```markdown
"If I did it..."
-O.J. Simpson
```
Probably a futile exercise to document the steps here, but this *really* is what I did!!!!

1. Create a Github repo & push the website's code to it
2. From settings in Github Repo → navigate to `Pages`
3. Set the `main` branch for deployments

WHOA! The page just started working at `esciafardini.github.io/esciafardini.com` - Insane, I know. I couldn't believe it myself.

Wow. Simple. Incredible. Okay.

Next step: point `esciafardini.com` to `esciafardini.github.io/esciafardini.com`

```bash
Q: WHAT DO I WANT?!?!?!

A: THE WEBSITE FROM MY GITHUB SERVED AT MY PURCHASED DOMAIN URL

Q: WHEN DO I WANT IT?!?!?!

A: NOW!!!!!
```

I saw a warning on github:
```markdown
Make sure you add your custom domain to your GitHub Pages site BEFORE configuring your custom domain with your DNS provider.
```

This brought me to my next step...

4. Add my custom domain name `esciafardini.com` to Github Pages

Sure, okay, but adding my custom domain to Github Pages gave me an error message:

![ERROR](posts/images/002-github-error.png)

GitHub ran a DNS check on `esciafardini.com` and said "No man, this domain does not resolve to one of our servers. Fix it or continue getting FAILURE messages."

Adding the domain name did have a side effect though - there is now a CNAME file in the GitHub repo. Interesting...

5. Consult these docs: [Managing A Custom Domain for Github Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)

Okay, it looks like I have to configure A and CNAME records in Cloudflare first? GitHub's `A` addresses are provided in the documentation linked above. Also need a www CNAME for the website. These can be added to my Cloudflare account it looks like. Mmmm, this feels a little chicken-egg to me, especially considering that warning about "adding your custom domain BEFORE configuring on your DNS provider". Whatever, I will carry on.

6. Configure `A` and `CNAME` records in Cloudflare

![Cloudflare DNS](posts/images/002-cloudflare-dns-settings.png)

Each DNS record is set to "DNS Only" (not Proxy). This means our domain URL points to Github's server (this should address the error we ran into earlier).

And it's alive!

![SUCCESS](posts/images/002-github-success.png)

DNS is configured such that `esciafardini.com` maps to GitHub Pages servers. It works!!!!

After about 5 minutes, the TLS certificate was provisioned. I was able to "Enforce HTTPS" and so this webpage will only be served via HTTPS!

## Fear-Based Recollection
I think I did things in the right order? Recalling github's warning:
```markdown
Make sure you add your custom domain to your GitHub Pages site BEFORE configuring your custom domain with your DNS provider.
```

This is that chicken-egg thing I mentioned earlier. I'm still unsure about the whole thing to be honest. I added the domain `esciafardini.com` to GitHub first (just like they told me to) but the DNS check failed. The CNAME was claimed on Github's end (or at least a file was created in the repo - is that the same thing???), but no records were configured yet in Cloudflare. Next, I added the `A` and the `CNAME` records in Cloudflare and everything fell into place.

## Questions, Answers

1. What is a DNS record?
```markdown
DNS records are instructions on DNS servers. They specify how a domain will work. IP Address information is part of the record.
```
2. What does @ mean when setting a DNS record?
```markdown
@ refers to the domain: esciafardini.com
```
3. What are `A` and `CNAME` records?
```markdown
A record specifies "This domain name maps to this IP Address".
We are mapping esciafardini.com to GitHub's server IP addresses.

CNAME (www) record specifies esciafardini.com is another name for esciafardini.github.io - so look that up instead.
```
4. Why are we using DNS-only instead of Proxy in Cloudflare?
```markdown
This way, Cloudflare answers the DNS lookup with GitHub IP addresses. We are using GitHub's servers. We do not want to use Cloudflare's servers.
```
5. What is TLS certificate provisioning?
```markdown
GitHub automatically requests and installs a TLS certificate (required for HTTPS).
```
6. What is Github doing when it does its DNS check?
```markdown
This step ensures that the domain has A addresses pointing to GitHub's servers.
```
7. Why does serving markdown files "just work" via Github Pages?
```markdown
GitHub Pages provides a static server so it's able to handle the fetch requests for the MD files without issue.
```
