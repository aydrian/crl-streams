import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const saveStream = async (stream, streamer) => {
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
  return createStream;
};

export const findStream = async (streamer_id) => {
  // Find stream where streamer_id equal broadcaster_user_id AND end_at is null
  const findFirstStream = await prisma.streams.findFirst({
    orderBy: {
      started_at: "desc"
    },
    select: {
      id: true,
      notifications: true
    },
    where: {
      streamer_id,
      AND: {
        ended_at: null
      }
    }
  });
  return findFirstStream;
};

export const updateStream = async (stream_id) => {
  const updateStream = await prisma.streams.update({
    data: {
      ended_at: new Date()
    },
    where: {
      id: stream_id
    }
  });
  return updateStream;
};

export const saveNotification = async (stream_id, message_ts) => {
  await prisma.notifications.create({
    data: {
      stream_id,
      channel_id: process.env.SLACK_CHANNEL_ID,
      message_ts
    }
  });
};
