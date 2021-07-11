export type SocketPayload = {
  content: string;
  username: string;
  color: string | '#1E90FF'; // Could make it a random color?
  channel: string;
  // isModerator: boolean;
  // isBroadcaster: boolean;
  // badges: string[]
};
