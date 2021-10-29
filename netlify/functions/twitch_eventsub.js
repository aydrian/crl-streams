import withVerifyTwitch from "../lib/withVerifyTwitch";

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
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello World" })
  };
}

export const handler = withVerifyTwitch(twitchHandler);
