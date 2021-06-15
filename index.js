const Discord = require('discord.js');
const config = require("./config.json");
const fs = require('fs')
const client = new Discord.Client();

// These are the possible time intervals, change to whatever you want.
var timeArray = new Array(30000, 70000, 40000, 90000, 15000, 7000, 20000, 80000);
const prefix = config.prefix;

var voiceChannel;

client.once('ready', () => {
  console.log("online");
});

client.on('message', message => {
 if (!message.member.voice.channel || !message.content.startsWith(prefix) || message.author.bot) return;

 const args = message.content.slice(prefix.length).trim().split(/ +/);
 const command = args.shift().toLowerCase();
 voiceChannel = message.member.voice.channel;
 var timer;

 if (command === 'join') {
   message.reply("*joining*");
   console.log(`${new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" })} - Joined VC`)
   var last = -1;

   voiceChannel.join().then(connection =>{

      // Play a sound on join
      connection.play(`audio/0.mp3`);
      function play() {
          let file = Math.floor(Math.random() * fs.readdirSync('audio').length);
          while (file == last) {
            file = Math.floor(Math.random() * fs.readdirSync('audio').length);
          }
          console.log(`playing file: ${file}.mp3`)
          connection.play(`audio/${file}.mp3`);
          timer = setTimeout(play, randRange(timeArray));
          last = file;
     }

     // waiting 5 seconds to play another sound, change to whatever you want
     timer = setTimeout(play, 5000);
   }).catch(err => console.log(err));

 } else if (command === 'leave') {
  message.reply("*leaving*");
  if(timer !== undefined) clearTimeout(timer);
  voiceChannel.leave();
  console.log(`${new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" })} - Disconnected from VC`)
}
});

function randRange(rarray) {
 var newTime = rarray[Math.floor(rarray.length * Math.random())];
 return newTime;
}

client.login(config.token);
