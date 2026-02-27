require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const TOKEN = process.env.TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

client.on("messageCreate", (message) => {
  if (message.channel.id !== CHANNEL_ID) return;
  if (message.author.bot) return;

  const attachment = message.attachments.first();
  if (!attachment) return;

  io.emit("newMedia", {
    username: message.member ? message.member.displayName : message.author.username,
    avatar: message.author.displayAvatarURL({ extension: "png", size: 256 }),
    media: attachment.url,
    caption: message.content || ""
  });
});

client.login(TOKEN);

server.listen(3000, () => {
  console.log("Overlay lancé sur http://localhost:3000");
});