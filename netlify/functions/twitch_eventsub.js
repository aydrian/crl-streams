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
      if (stream) {
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
      // Update stream ended_at where streamer_id equal broadcaster_user_id AND end_at is null
      const findFirstStream = await prisma.streams.findFirst({
        orderBy: {
          started_at: "desc"
        },
        select: {
          id: true
        },
        where: {
          streamer_id: event.broadcaster_user_id,
          AND: {
            ended_at: null
          }
        }
      });
      console.log("findFirstStream", findFirstStream);
      if (findFirstStream) {
        const updateStream = await prisma.streams.update({
          data: {
            ended_at: new Date()
          },
          where: {
            id: findFirstStream.id
          },
          select: {
            id: true,
            title: true,
            game_name: true,
            streamer: {
              select: {
                login: true,
                profile_image_url: true
              }
            }
          }
        });

        console.log(`Stream: `, updateStream);
      }
    }
  }

  return {
    statusCode: 200
  };
}

export const handler = withVerifyTwitch(twitchHandler);
