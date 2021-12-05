import { findStream, saveNotification, saveStream, updateStream } from "./db";
import { sendOffline, sendOnline } from "./slack";
import { twitch } from "./twitch";

export const handleStreamOnline = async (event) => {
  const stream = await twitch.streams.getStreamByUserId(
    event.broadcaster_user_id
  );
  if (!stream) {
    console.log(`Stream for ${event.broadcaster_user_name} not found.`);
    return;
  }
  const streamer = await stream.getUser();
  await saveStream(stream, streamer);
  const game = await stream.getGame();
  const message = await sendOnline(stream, streamer, game);
  await saveNotification(stream.id, message.ts);
};

export const handleStreamOffline = async (event) => {
  const findStreamResult = await findStream(event.broadcaster_user_id);
  if (!findStreamResult) {
    console.log(
      `Stream for ${event.broadcaster_user_name} not found in database.`
    );
    return;
  }

  await updateStream(findStreamResult.id);

  if (findStreamResult.notifications.length === 0) {
    console.log(`No notification saved for stream.`);
    return;
  }
  const [notif] = findStreamResult.notifications;
  const { data } = await twitch.videos.getVideosByUser(
    event.broadcaster_user_id,
    { limit: 1, orderBy: "time" }
  );
  const [video] = data;
  if (!video) {
    console.log(`Video for ${event.broadcaster_user_name} not found.`);
    return;
  }
  const streamer = await video.getUser();
  const game = await twitch.games.getGameByName(findStreamResult.game_name);
  await sendOffline(notif, video, streamer, game);
};
