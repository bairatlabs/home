# OnePage official website destination

Prepared October 14, 2026, America/New_York. Website only. This describes the narrowly approved consolidation, not a claim of ranking improvement.

The official product homepage is https://tryonepage.com/. Four company-homepage product links point directly there. The old marketing HTML is an immediate meta-refresh fallback with the same canonical and an ordinary destination link. This fallback is not an HTTP 301; the permanent HTTP redirect is an independent Cloudflare rule.

## Exact edge rule

Name: `OnePage official website`

```text
(http.host in {"bairatlabs.com" "www.bairatlabs.com"} and http.request.uri.path in {"/onepage" "/onepage/" "/onepage/index.html"})
```

Action: static URL redirect to `https://tryonepage.com/`, status 301, preserve query string. Match incoming HTTP and HTTPS without redirecting any child route. Do not use a prefix/wildcard including privacy or deletion pages. Do not modify DNS, security protections, app links or other rules.

The origin fallback intentionally uses a fixed target rather than JavaScript or query interpretation. The edge redirect preserves incoming campaign parameters.

## Verification and rollback

Run `node --test scripts/onepage-destination.test.mjs` and `git diff --check`. After publication, verify edge scope and source deployment separately: landing aliases return 301 to the intended destination; campaign query survives; destination returns 200/self-canonical; privacy/deletion/company homepage remain available; company product links point directly to the official site. Inspect the deployed rule instead of treating the local scope model as provider proof.

Keep provider/public verification in the OnePage SEO recovery ledger. A push is not publication proof, and redirect success is not Google recrawl or ranking proof. Existing October 7 checkpoints remain unchanged.

Rollback: disable only the named edge rule, then revert this specific website commit if explicitly restoring the prior landing page. Preserve unrelated work. The privacy and deletion source files are unchanged.
