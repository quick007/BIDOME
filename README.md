# Bidome Bot

## What is Bidome bot

Bidome bot is a multipurpose discord bot that features Fun commands & Music

## Selfhosting

### Getting started

It is suggested to use the publically avalible Bidome bot located
[Here](https://discord.com/api/oauth2/authorize?client_id=778670182956531773&permissions=8&scope=applications.commands%20bot)
but if you want to host your own version continue reading.

### Requirements

    - Java (Java 11 required, 16 suggested)
    - Deno
    - A discord bot

### Selfhosting

    1. Create a file called `.env` with the contents of `.env.example`
    2. Set up lavalink:
        * If you already have a lavalink node:
            - Place your Lavalink credentials in .env
            - Uncomment the `Don't launch lavalink` command from run.sh & Comment the `Launch Lavalink` command
        * If you don't have a lavalink node:
            - Download Lavalink from [Github](https://github.com/freyacodes/Lavalink)
            - Set the credentials in .env to what is in `application.yml`
    3. Enable the `presence` & `server members` intent on the discord dashboard
    4. Run the bot
