CREATE DATABASE IF NOT EXISTS crl_streams;

USE crl_streams;

CREATE TABLE streamers (
  id STRING PRIMARY KEY,
  login STRING NOT NULL,
  profile_image_url STRING NOT NULL
);

CREATE TABLE subscriptions (
  id STRING PRIMARY KEY,
  type STRING NOT NULL,
  streamer_id STRING NOT NULL REFERENCES streamers (id) ON DELETE CASCADE
);

CREATE TABLE streams (
  id STRING PRIMARY KEY,
  title STRING,
  view_count INT,
  game_name STRING,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  streamer_id STRING NOT NULL REFERENCES streamers (id) ON DELETE CASCADE
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id STRING NOT NULL,
  message_ts STRING NOT NULL,
  stream_id STRING NOT NULL REFERENCES streams (id) ON DELETE CASCADE
);