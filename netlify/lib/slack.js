import { WebClient } from "@slack/web-api";

const client = new WebClient();

export const sendOnline = async (stream, streamer) => {
  const result = await client.chat.postMessage({
    token: process.env.SLACK_BOT_TOKEN,
    channel: process.env.SLACK_CHANNEL_ID,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `🔴 ${streamer.name} is online. ${stream.title}`
        },
        accessory: {
          type: "image",
          image_url: `${streamer.profilePictureUrl.replace(
            "{width}x{height}",
            ""
          )}`,
          alt_text: `${streamer.name}`
        }
      },
      {
        type: "image",
        image_url: `${stream.thumbnailUrl.replace(
          "{width}x{height}",
          "1280x720"
        )}`,
        alt_text: `${stream.title}`
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Come hang out!",
              emoji: true
            },
            url: `https://twitch.tv/${streamer.displayName}`
          }
        ]
      }
    ]
  });
  return result;
};

export const sendOffline = async (notif, video, streamer) => {
  const result = await client.chat.update({
    token: process.env.SLACK_BOT_TOKEN,
    channel: notif.channel_id,
    ts: notif.message_ts,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${streamer.displayName} was online.\n ${video.title}`
        },
        accessory: {
          type: "image",
          image_url: `${streamer.profilePictureUrl.replace(
            "{width}x{height}",
            ""
          )}`,
          alt_text: `${streamer.name}`
        }
      },
      {
        type: "image",
        image_url: `${video.thumbnailUrl.replace(
          "%{width}x%{height}",
          "1280x720"
        )}`,
        alt_text: `${video.title}`
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Watch",
              emoji: true
            },
            url: video.url
          }
        ]
      },
      {
        type: "context",
        elements: [
          {
            type: "plain_text",
            text: `Finished streaming • Streamed for ${video.duration}`,
            emoji: true
          }
        ]
      }
    ]
  });
  return result;
};
