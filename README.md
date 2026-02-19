Create Two Folders Inside Main Folder With other Files 
Ist: "Links"  (This will Hold links of your sites that are inside Sites Folder After making them online.)
IInd: "Sites"  (this If The folder inside your folder you can keep a single html or a full folder of web or any project you have and want to make online as much as you want it will turn them all online and will provide you link for that in links folder.)


ONLINE OR RUN PROJECT
_________________________


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

