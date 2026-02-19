# Private-Server
A private server works on your device and helps to make your project online, shareable, and accessible to anyone with a link. It will be online only when your device is on and the server is running.





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
