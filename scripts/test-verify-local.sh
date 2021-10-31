#!/bin/sh
TWITCH_SIGNING_SECRET=$(ntl env:get TWITCH_SIGNING_SECRET)
twitch event verify-subscription subscribe -F http://localhost:8888/webhooks/twitch -s $TWITCH_SIGNING_SECRET
