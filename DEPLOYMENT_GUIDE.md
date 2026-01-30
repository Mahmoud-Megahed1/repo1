# Deployment Guide to VPS

Since I cannot access your server directly due to security restrictions, follow these steps to deploy your **ready-to-go** build artifacts.

## Step 1: Connect to your VPS
Open a terminal (PowerShell or Command Prompt) and run:
```powershell
ssh -p 21098 root@104.207.65.159
```
*Enter password: `l9u4Yr76xYtTjYm9`*

## Step 2: Provision the Server
Copy the `server_provision.sh` script to your server and run it.
**On Local Machine (PowerShell):**
```powershell
scp -P 21098 ./server_provision.sh root@104.207.65.159:~/
```
**On Server (SSH):**
```bash
chmod +x server_provision.sh
./server_provision.sh
```

## Step 3: Upload Build Artifacts
We will stick to uploading the **Zipped Artifacts** I created locally (`zip_artifacts.ps1`). This is safer because these artifacts contain the **fixes** I made (which are not yet on GitHub).

**On Local Machine (PowerShell):**
```powershell
scp -P 21098 ./backend_deploy.zip root@104.207.65.159:/var/www/englishom/
scp -P 21098 ./admin_panel_deploy.zip root@104.207.65.159:/var/www/englishom/
scp -P 21098 ./user_app_deploy.zip root@104.207.65.159:/var/www/englishom/
scp -P 21098 ./englishom.nginx root@104.207.65.159:/etc/nginx/sites-available/englishom
```

## Step 4: Final Setup on Server
**On Server (SSH):**

1.  **Unzip Files:**
    ```bash
    cd /var/www/englishom
    unzip backend_deploy.zip -d backend
    unzip admin_panel_deploy.zip -d admin
    unzip user_app_deploy.zip -d user
    ```

2.  **Start Backend (PM2):**
    ```bash
    cd /var/www/englishom/backend
    npm install --production --force
    pm2 start dist/main.js --name "englishom-backend"
    ```

3.  **Start Admin Panel (PM2):**
    ```bash
    cd /var/www/englishom/admin
    # Install dependencies
    npm install --production --force
    pm2 start npm --name "englishom-admin" -- start -- -p 3000
    ```

4.  **Configure Nginx:**
    ```bash
    ln -s /etc/nginx/sites-available/englishom /etc/nginx/sites-enabled/
    rm /etc/nginx/sites-enabled/default
    nginx -t
    systemctl restart nginx
    ```

5.  **SSL Certificate:**
    ```bash
    certbot --nginx -d englishom.com -d www.englishom.com
    ```
