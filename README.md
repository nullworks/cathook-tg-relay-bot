# cathook-tg-relay-bot
Relay bot for catbots on Telegram

# How do i Set up this Bot?
- Download this repository and `cd` inside of it
- Run `npm i` and install the dependencies
- Get a Telegram bot using the [BotFather](https://t.me/BotFather)
- Retrieve the auth token and save it in `config.json` by replacing `Your Telegram bot token here` With the appropiate token.
- Create a Channel/Group and add Your bot to it (See below on how to add the Bot)
![](https://i.imgur.com/scinN4O.png)

![](https://i.imgur.com/LVQgGSo.png)

![](https://i.imgur.com/lo82yxM.png)

![Obviously, Search YOUR bot here, not ours](https://i.imgur.com/BRclXtO.png)

![](https://i.imgur.com/yb2iB3p.png)
- You will now need to get your channel ID,to do this send a message to your channel, and Forward it to the [GetIDs Bot](https://t.me/getidsbot)
- Copy the "Origin chat" id field (including the minus, see below)

![](https://i.imgur.com/VI5t4IF.png)
- Put the ID in `config.json` by replacing `Your Channel ID here` with the channel ID.
- You are now done with setting the bot up

# How do i use this bot?
- After your catbots initialized the `.csv` files in `/opt/cathook/data` after their first few ingame moments, Run the bot by typing `node bot.js`
- The bot will now automatically log every Chat message received to your relay channel.
- Enjoy the salt :)
