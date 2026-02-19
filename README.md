STEP 1: Start local server
Command:
    node server.js

STEP 2: Start Cloudflare Tunnel
Command:
    cloudflared tunnel --url http://localhost:3000

STEP 3: Start auto-tunnel.ps1
Command :
    .\auto-tunnel.ps1


    or for Specific html file

    .\auto-tunnel.ps1 -htmlFile "index.html"
