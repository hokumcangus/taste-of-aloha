@echo off
REM Prisma CLI wrapper to use DATABASE_URL from .env
REM Usage: prisma-cli.bat studio --port 5555

REM Load .env file
for /f "tokens=*" %%i in ('type .env ^| find "DATABASE_URL"') do set %%i

REM Run Prisma with --url flag
npx prisma %* --url "%DATABASE_URL%"
