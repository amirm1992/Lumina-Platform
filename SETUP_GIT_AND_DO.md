# Lumina: GitHub & Digital Ocean Setup

This doc ensures your local repo is connected to GitHub (for push/commit) and gives you direct access to Digital Ocean (deploy + database).

---

## 1. GitHub (push & commit)

### Current remotes

- **origin** → `https://github.com/amirm1992/Lumina-Platform.git` (main branch)
- **demo** → `https://github.com/amirm1992/Lumina-demo.git`

All normal pushes and deploys use **origin** and **main**.

### One-time: make sure you can push

**Option A – HTTPS (personal access token)**

1. GitHub → Settings → Developer settings → Personal access tokens.
2. Create a token with `repo` scope.
3. When you run `git push origin main`, use the token as the password (username = your GitHub username).

**Option B – SSH (recommended)**

```bash
# Generate key if you don't have one
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to ssh-agent and copy public key to clipboard (macOS)
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
pbcopy < ~/.ssh/id_ed25519.pub
```

Then: GitHub → Settings → SSH and GPG keys → New SSH key → paste.

Switch remote to SSH (optional):

```bash
git remote set-url origin git@github.com:amirm1992/Lumina-Platform.git
git push origin main
```

**Option C – GitHub CLI**

```bash
brew install gh
gh auth login
# Follow prompts; then git push origin main will use your account
```

### Committing and pushing (you or Cursor)

- Use branch: **main**.
- Use remote: **origin**.
- Deploy to Digital Ocean by pushing to **origin main** (DO is already connected to this repo).

```bash
git add .
git commit -m "Your message"
git push origin main
```

Or use the project script:

```bash
./deploy.sh
# Choose option 1 (Push to GitHub) and use remote: origin, branch: main
```

---

## 2. Digital Ocean (direct access)

Your GitHub repo is already connected to Digital Ocean App Platform; pushing to **origin main** triggers a deploy. For **direct** control (CLI, DB, env):

### One-time: doctl (Digital Ocean CLI)

```bash
brew install doctl
doctl auth init
# Paste your DO API token when prompted (from https://cloud.digitalocean.com/account/api/tokens)
```

Useful commands:

```bash
doctl apps list                    # List apps; note your Lumina App ID
doctl apps get <app-id>            # App details
doctl apps create-deployment <app-id>   # Trigger a new deploy without pushing
doctl databases list               # List databases (if you use DO managed DB)
```

### Database (direct access)

- **Production DB** is managed by Digital Ocean; connection string is in App Platform env as **DATABASE_URL**.
- To get it: DO Dashboard → your App → Settings → App-Level Environment Variables → **DATABASE_URL** (copy).
- Use the same **DATABASE_URL** in local `.env.local` if you want to run Prisma against production (use with care).

Run migrations on the DB DO uses:

```bash
# Ensure .env.local has that DATABASE_URL, then:
npx prisma migrate deploy
```

### Quick links

- **App Platform:** https://cloud.digitalocean.com/apps  
- **Databases:** https://cloud.digitalocean.com/databases  
- **API tokens:** https://cloud.digitalocean.com/account/api/tokens  

---

## 3. Summary

| Goal              | What to use                          |
|-------------------|--------------------------------------|
| Push code         | `git push origin main`               |
| Deploy            | Push to `origin main` (auto) or `./deploy.sh` → option 1 |
| Deploy via CLI    | `doctl apps create-deployment <app-id>` |
| DB migrations     | Set `DATABASE_URL` in `.env.local`, run `npx prisma migrate deploy` |
| Inspect DO        | `doctl apps list`, DO dashboard links above |

Once GitHub auth (SSH or token) and optionally `doctl auth init` are done, you and Cursor can commit/push to **origin main** and you have direct access to Digital Ocean from the CLI and dashboard.
