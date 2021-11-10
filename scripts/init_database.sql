CREATE DATABASE IF NOT EXISTS crl_streams;

USE crl_streams;

CREATE TABLE streamers (
  id STRING(50) PRIMARY KEY,
  login STRING(50) NOT NULL,
  profile_image_url STRING(3000) NOT NULL
);

CREATE TABLE subscriptions (
  id STRING(50) PRIMARY KEY,
  type STRING(255) NOT NULL,
  streamer_id STRING(50) NOT NULL REFERENCES streamers (id) ON DELETE CASCADE
);

CREATE TABLE streams (
  id STRING(50) PRIMARY KEY,
  title STRING,
  view_count INT,
  game_name STRING,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  streamer_id STRING(50) NOT NULL REFERENCES streamers (id) ON DELETE CASCADE
);