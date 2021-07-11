import express, { Request, Response } from 'express';
import chalk from 'chalk';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { initClient } from './client';
import { allEmotes, allEmoteNames } from './emotes';

import { SocketPayload } from '~/@types/payload';

const allEmoteRegexes: RegExp[] = [];
for (const name of allEmoteNames) {
  allEmoteRegexes.push(new RegExp(`(?<=(\\s|^))(${name})(?=(\\s|$))`, 'g'));
}

function replaceAllEmotesWithLinks(msg: string): string | undefined {
  let result = msg;
  for (const reg of allEmoteRegexes) {
    const matches = msg.match(reg);
    // if (matches !== null) {
    //   console.log(reg, matches);
    // }
    if (matches) {
      if (matches.length > 0) {
        const emote = matches[0];
        result = result.replace(
          reg,
          `<img src="${allEmotes[emote]}" alt="${emote}" />`
        );
      }
    }
  }
  // If there are no emotes return undefined
  if (result === msg) return;
  return result;
}
const clientChosenEmotes: Map<string, string[]> = new Map();

const app = express();
app.set('view engine', 'pug');
app.use(express.static('public'));

const channelsToJoin = ['xqcow'];

const httpServer = createServer(app);
const io = new Server(httpServer);

async function main() {
  const client = initClient(channelsToJoin);
  client.on('connecting', () => {
    console.log(
      chalk.yellow.underline(
        `Attempting to connect to channels: ${channelsToJoin}`
      )
    );
  });
  client.on('join', (channel: string, username: string, self: boolean) => {
    if (!self) return;
    if (self) {
      console.log(
        `Successfully joined channel ${chalk.green.underline(
          `-->${channel}<--`
        )}`
      );
    }
  });
  client.on('message', (channel, tags, message, self) => {
    // console.log(`${tags['display-name']}: ${message}`);
    if (!tags['display-name']) {
      console.error('Message with no username monkaW');
      return;
    }

    const parsed = replaceAllEmotesWithLinks(message);
    if (parsed !== undefined) {
      const payload: SocketPayload = {
        content: parsed,
        username: tags['display-name'],
        color: tags.color ? tags.color : '#1E90FF',
        channel: channel
      };
      io.emit('payload', payload);
    }
  });
  await client.connect();

  io.on('connection', (socket) => {
    console.log('Client connected');
    socket.emit('allEmoteNames', allEmoteNames);
  });
}

main();
app.get('/', (req: Request, res: Response) => {
  res.render('index');
});

httpServer.listen(4040, () => {
  console.log('Listening on http://localhost:4040');
});
