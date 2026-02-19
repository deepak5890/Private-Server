# -------------------------------
# Auto Cloudflare Tunnel with Daily File and Timestamped Links
# -------------------------------

# Get current date and time
$now = Get-Date
$monthName = $now.ToString("MMMM")  # Full month name
$day = $now.Day
$year = $now.Year

# Create daily link file: Link-MonthDate_Year.txt
$linksDir = "links"
if (-not (Test-Path $linksDir)) {
    New-Item -ItemType Directory -Path $linksDir | Out-Null
}

$linkFile = Join-Path $linksDir "Link-$monthName$day`_$year.txt"

Write-Host "Saving link to file: $linkFile"

Write-Host "Starting Cloudflare Tunnel..."
Write-Host "Waiting for public link..."

# Capture both stdout and stderr
cloudflared tunnel --url http://localhost:3000 2>&1 | ForEach-Object {
    if ($_ -match "https://.*trycloudflare.com") {
        $url = $Matches[0]

        # Escape URL for Select-String
        $escapedUrl = [regex]::Escape($url)

        # Check if the link is already in the file
        if (-not (Test-Path $linkFile) -or -not (Select-String -Path $linkFile -Pattern $escapedUrl -Quiet)) {

            # Get timestamp for this link
            $linkTime = (Get-Date).ToString("yyyy-MM-dd hh:mm:ss tt")

            # Prepare entry for this link
            $entry = @"
Date: $($linkTime.Split(' ')[0])
Time: $($linkTime.Split(' ')[1] + ' ' + $linkTime.Split(' ')[2])
Generated Link:
$url




"@

            # Append entry to the daily file
            Add-Content $linkFile $entry

            Write-Host "✅ LINK SAVED: $url"
            # Copy link to clipboard
            Set-Clipboard $url
            Write-Host "✅ LINK COPIED TO CLIPBOARD"
        }
    }
}
