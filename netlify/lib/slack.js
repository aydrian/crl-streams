import { WebClient } from "@slack/web-api";

const client = new WebClient();

export const sendOnline = async (stream, streamer, game) => {
  const result = await client.chat.postMessage({
    token: process.env.SLACK_BOT_TOKEN,
    channel: process.env.SLACK_CHANNEL_ID,
    text: `🔴 ${streamer.name} is online.`,
    blocks: [
      {
        type: "header",
        text: { type: "plain_text", text: `🔴 ${streamer.name} is online.` }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*<https://twitch.tv/${streamer.displayName}|${stream.title}>*`
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
        type: "context",
        elements: [
          {
            alt_text: game.name,
            image_url: game.boxArtUrl,
            type: "image"
          },
          {
            text: `Playing ${game.name}`,
            type: "mrkdwn"
          }
        ]
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

export const sendOffline = async (notif, video, streamer, game) => {
  const result = await client.chat.update({
    token: process.env.SLACK_BOT_TOKEN,
    channel: notif.channel_id,
    ts: notif.message_ts,
    text: `${streamer.name} was online.`,
    blocks: [
      {
        type: "header",
        text: { type: "plain_text", text: `${streamer.name} was online.` }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*<${video.url}|${video.title}>*`
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
        type: "context",
        elements: [
          {
            alt_text: game.name,
            image_url: game.boxArtUrl,
            type: "image"
          },
          {
            text: `Playing ${game.name}`,
            type: "mrkdwn"
          }
        ]
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Watch VOD",
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
