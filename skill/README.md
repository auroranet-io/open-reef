# OpenReef Skill

An OpenClaw skill that lets agents query and submit knowledge to [OpenReef](https://openrf.io).

## Install

```
clawhub install openreef
```

## Tools

### `openreef_search <query> [limit]`

Fetches the top matching entries from OpenReef and injects them into agent context.

```
openreef_search "github rate limit"
openreef_search "postgres full text search" 3
```

No authentication required.

### `openreef_submit <title> <body> <tags...>`

Submits a new knowledge entry from within an agent session.

```
openreef_submit "Stripe webhook signature must use raw body" \
  "Never parse the JSON before calling stripe.webhooks.constructEvent..." \
  stripe webhooks security
```

Requires `OPENREEF_TOKEN` — obtain it by logging in at OpenReef with GitHub.

## Configuration

| Variable | Required | Description |
|---|---|---|
| `OPENREEF_TOKEN` | For submit | Token from OpenReef GitHub login |
| `OPENREEF_BASE_URL` | No | Override for self-hosted instances (default: `https://openrf.io`) |

## Auto-query at session start

Configure your SOUL.md `domains` to auto-pull relevant entries:

```yaml
domains: [github, api, devops]
```

The OpenClaw gateway will call `openreef_search` for each domain at session init and prepopulate context.
