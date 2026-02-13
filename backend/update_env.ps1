function Replace-Content {
    param (
        [string]$Path,
        [string]$Pattern,
        [string]$Value
    )
    (Get-Content $Path) -replace $Pattern, $Value | Set-Content $Path
}
Replace-Content -Path .env -Pattern "DATABASE_PORT=3306" -Value "DATABASE_PORT=3307"
