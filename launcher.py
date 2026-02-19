import subprocess
import os
import time
import threading
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SITES_DIR = os.path.join(BASE_DIR, "sites")
LINKS_DIR = os.path.join(BASE_DIR, "links")

os.makedirs(LINKS_DIR, exist_ok=True)

# -------------------------------
# Start Node server with auto-reload
# -------------------------------
print("Starting Node server (nodemon)...")
NPX_PATH = r"C:\nvm4w\nodejs\npx.cmd"

subprocess.Popen(
    [NPX_PATH, "nodemon", "server.js"],
    cwd=BASE_DIR,
    stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL
)



time.sleep(3)

# -------------------------------
# Start Cloudflare Tunnel
# -------------------------------
print("Starting Cloudflare tunnel...")

tunnel = subprocess.Popen(
    ["powershell", "-ExecutionPolicy", "Bypass", "-File", "auto-tunnel.ps1"],
    cwd=BASE_DIR,
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True,
    bufsize=1
)

public_url = None
link_saved = False


def handle_tunnel_output():
    global public_url, link_saved

    for line in tunnel.stdout:
        print(line.strip())

        if (not link_saved) and ("trycloudflare.com" in line):
            # Extract URL safely
            for word in line.split():
                if "https://" in word and "trycloudflare.com" in word:
                    public_url = word.strip()
                    save_links(public_url)
                    link_saved = True


def save_links(base_url):
    now = datetime.now()
    file_name = f"Link-{now.strftime('%B')}{now.day}_{now.year}.txt"
    file_path = os.path.join(LINKS_DIR, file_name)

    with open(file_path, "a", encoding="utf-8") as f:
        f.write(f"\nBase URL: {base_url}\n")
        f.write(f"Generated at: {now}\n\n")

        if not os.path.exists(SITES_DIR):
            f.write("No sites folder found.\n")
            return

        for site in os.listdir(SITES_DIR):
            site_path = os.path.join(SITES_DIR, site)
            if os.path.isdir(site_path):
                full_link = f"{base_url}/{site}"
                f.write(f"{site} → {full_link}\n")
                print(f"✅ ONLINE: {full_link}")

    print("\nAll sites are online.\n")


# -------------------------------
# Run tunnel reader in background
# -------------------------------
threading.Thread(target=handle_tunnel_output, daemon=True).start()

# -------------------------------
# Keep launcher alive forever
# -------------------------------
print("Server + Tunnel running. Do not close this window.\n")

while True:
    time.sleep(60)
