# SEO Custom-Domain Launch

Use only the production domain supplied and owned by the store operator. In the steps below, `PRODUCTION_ORIGIN` means the exact user-supplied HTTPS origin after Vercel confirms that domain is connected. Do not substitute or invent a hostname.

1. Connect the owned domain to the Vercel project and wait for Vercel to confirm its configuration.
2. Set `NEXT_PUBLIC_APP_URL` in Vercel Production to `PRODUCTION_ORIGIN`, the exact HTTPS URL of the connected production domain.
3. Redeploy, then verify that canonical, sitemap, robots, `/llms.txt`, Open Graph, checkout callback, and product feed URLs all use `PRODUCTION_ORIGIN`.
4. Add and verify the production-domain property in Google Search Console and Bing Webmaster Tools.
5. Submit `${PRODUCTION_ORIGIN}/sitemap.xml` to both webmaster platforms.
6. Add the IndexNow key and submit changed canonical URLs only after the production domain is stable.
7. Update social profiles and merchant destinations to use the production domain.
8. Retain the Vercel domain as a redirect to the production domain, not as a second canonical host.
