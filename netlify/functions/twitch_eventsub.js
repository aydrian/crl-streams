import withVerifyTwitch from "../lib/withVerifyTwitch";
import { PrismaClient } from "@prisma/client";
import { twitch } from "../lib/twitch";

const prisma = new PrismaClient();

async function twitchHandler(event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { Allow: "POST" },
      body: "Method Not Allowed"
    };
  }

  const body = JSON.parse(event.body);
  const messageType = event.headers["twitch-eventsub-message-type"];
  if (messageType === "webhook_callback_verification") {
    return {
      statusCode: 200,
      body: body.challenge
    };
  } else if (messageType === "notification") {
    const {
      event,
      subscription: { type }
    } = body;

    console.log(
      `Receiving ${type} request for ${event.broadcaster_user_name}: `,
      event
    );

    if (type === "stream.online") {
      const stream = await twitch.streams.getStreamByUserId(
        event.broadcaster_user_id
      );
      console.log(`Stream Title: ${stream.title}`);
      const streamer = await stream.getUser();
      console.log(`Streamer: ${streamer.name}`);
      const createStream = await prisma.streams.create({
        data: {
          id: stream.id,
          title: stream.title,
          view_count: stream.viewers,
          game_name: stream.gameName,
          started_at: stream.startDate,
          streamer: {
            connectOrCreate: {
              create: {
                id: streamer.id,
                login: streamer.name,
                profile_image_url: streamer.profilePictureUrl
              },
              where: {
                id: streamer.id
              }
            }
          }
        }
      });
      console.log(createStream);
    }
  } else if (type === "stream.offline") {
    const {
      data: [stream]
    } = await twitch.streams.getStreams({
      userId: event.broadcaster_user_id
    });
    console.log(`Stream Title: ${stream.title}`);
    const updateStream = await prisma.streams.update({
      data: {
        ended_at: Date.now(),
        view_count: stream.viewers
      },
      where: {
        id: stream.id
      }
    });
  }

  return {
    statusCode: 200
  };
}

export const handler = withVerifyTwitch(twitchHandler);
