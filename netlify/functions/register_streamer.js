import { twitch } from "../lib/twitch";
import { PrismaClient } from "@prisma/client";

const WEBHOOK_URL = "https://crl-streams.netlify.app/webhooks/twitch";

const prisma = new PrismaClient();

export async function handler(event, _context) {
  const { username } = event.queryStringParameters;

  const streamer = await twitch.users.getUserByName(username);

  if (!streamer) {
    return {
      statusCode: 404,
      body: "User not found."
    };
  }

  const onlineSubResult = await twitch.eventSub.createSubscription(
    "stream.online",
    "1",
    {
      broadcaster_user_id: streamer.id
    },
    {
      secret: process.env.TWITCH_SIGNING_SECRET,
      callback: WEBHOOK_URL,
      method: "webhook"
    }
  );

  const offlineSubResult = await twitch.eventSub.createSubscription(
    "stream.offline",
    "1",
    {
      broadcaster_user_id: streamer.id
    },
    {
      secret: process.env.TWITCH_SIGNING_SECRET,
      callback: WEBHOOK_URL,
      method: "webhook"
    }
  );

  const upsertUser = await prisma.streamers.upsert({
    where: {
      id: streamer.id
    },
    create: {
      id: streamer.id,
      login: streamer.name,
      profile_image_url: streamer.profilePictureUrl,
      subscriptions: {
        createMany: {
          data: [
            { id: onlineSubResult.id, type: onlineSubResult.type },
            { id: offlineSubResult.id, type: offlineSubResult.type }
          ]
        }
      }
    },
    update: {
      subscriptions: {
        createMany: {
          data: [
            { id: onlineSubResult.id, type: onlineSubResult.type },
            { id: offlineSubResult.id, type: offlineSubResult.type }
          ]
        }
      }
    },
    include: {
      subscriptions: true
    }
  });

  return {
    statusCode: 200,
    body: JSON.stringify(upsertUser)
  };
}
