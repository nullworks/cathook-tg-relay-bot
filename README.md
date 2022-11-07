[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)
# cathook-tg-relay-bot
Telegram relay bot for catbots

# How do I set up this bot?
- Download this repository and `cd` inside of it
- Run `npm i` and install the dependencies
- Get a Telegram bot using the [BotFather](https://t.me/BotFather)
- Retrieve the auth token and save it in `config.json` by replacing `Your Telegram bot token here` With the appropriate token.
- Create a channel/group and add your bot to it (see below on how to add the bot)

![](https://i.imgur.com/scinN4O.png)

![](https://i.imgur.com/LVQgGSo.png)

![](https://i.imgur.com/lo82yxM.png)

Obviously, search YOUR bot here, not ours

![](https://i.imgur.com/BRclXtO.png)

![](https://i.imgur.com/yb2iB3p.png)
- You will now need to get your channel ID; to do so send a message in your channel, and forward it to [GetIDs Bot](https://t.me/getidsbot)
- Copy the "Origin chat" id field (including the minus, see below)

![](https://i.imgur.com/VI5t4IF.png)
- Put the id in `config.json` by replacing `Your Channel ID here` with the channel ID.
- You are now done with setting the bot up

# How do I use this bot?
- Once your catbots have initialized the `.csv` files in `/opt/cathook/data` after their first few in-game moments, run the bot by typing `node bot.js`
- The bot will now automatically log every chat message received to your relay channel.
- Enjoy the salt :)
