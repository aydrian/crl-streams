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