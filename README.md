# Cockroach Labs Streams

[![Netlify Status](https://api.netlify.com/api/v1/badges/e4f2b5c5-78fb-4aac-8a99-b84dfeb1e6c6/deploy-status)](https://app.netlify.com/sites/crl-streams/deploys)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

## Overlays

### Emote Drop

Inspired by [Jason Lengstorf's](https://www.twitch.tv/jlengstorf) Boop Drop. See the [Learn with Jason episode](https://www.learnwithjason.dev/).

This Overlay will listen emotes and the chat and drop them onto your screen.

url: `https://crl-streams.netlify.app/emotedrop/{twitchLogin}/{emotes}?canvas={width}x{height}`

params:

- twitchLogin (**required**) - The Twitch user who's chat the overlay will listen to.
- emotes - A comma separated list of emotes to listen for. e.g. `CorgiDerp,DoritosChip` default: `CorgiDerp`
- canvas - The size of the frame. default: `1920x1080`
  - width - The width of the frame
  - height - The height of the frame
