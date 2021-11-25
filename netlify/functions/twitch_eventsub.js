import withVerifyTwitch from "../lib/withVerifyTwitch";
import { PrismaClient } from "@prisma/client";
import { handleStreamOnline, handleStreamOffline } from "../lib/eventHandlers";

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
      await handleStreamOnline(event);
    } else if (type === "stream.offline") {
      await handleStreamOffline(event);
    }
  }

  return {
    statusCode: 200
  };
}

export const handler = withVerifyTwitch(twitchHandler);
