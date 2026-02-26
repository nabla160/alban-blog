# Déploiement sur VPS Hostinger

## Prérequis sur le VPS

```bash
# Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# PM2
npm install -g pm2

# Git
sudo apt install -y git

# Nginx + Certbot
sudo apt install -y nginx certbot python3-certbot-nginx
```

## Cloner et builder le projet

```bash
cd /var/www
git clone <url-du-repo> alban-blog
cd alban-blog
npm install
npm run build
```

## Lancer avec PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup   # suivre les instructions affichées
```

## Configurer Nginx

Fichier : `/etc/nginx/sites-available/alban-blog`

```nginx
server {
    listen 80;
    server_name alban.laulhe.io;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/alban-blog /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## SSL avec Let's Encrypt

```bash
sudo certbot --nginx -d alban.laulhe.io
```

Certbot modifie Nginx automatiquement pour le HTTPS et met en place le renouvellement automatique.

## Mettre à jour le site

```bash
cd /var/www/alban-blog
git pull
npm install
npm run build
pm2 restart alban-blog
```

## Ajouter du contenu

1. Créer un fichier `content/projets/mon-projet.mdx` avec le frontmatter :
   ```
   ---
   title: "Titre du projet"
   date: "2025-01"
   description: "Description courte"
   tags: ["Tag1", "Tag2"]
   category: "Projet 3A"
   ---
   ```
2. Écrire le contenu en Markdown sous le frontmatter
3. `git add . && git commit -m "Ajout projet" && git push`
4. Sur le VPS : `git pull && npm run build && pm2 restart alban-blog`
