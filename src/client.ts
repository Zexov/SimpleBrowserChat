import chalk from 'chalk';
import tmi from 'tmi.js';

export const initClient = (allChannelNames: string[]): tmi.Client => {
  console.log(
    `Trying to join the following channels: ${chalk.magenta.underline(
      allChannelNames.join(',')
    )}`
  );
  console.log(chalk.red.underline(`STARTING IN DEV ANONYMOUS MODE`));
  return new tmi.Client({
    options: { debug: false },
    connection: { reconnect: true },
    channels: allChannelNames
  });
};
