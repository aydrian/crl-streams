#!/bin/sh
TWITCH_SIGNING_SECRET=$(ntl env:get TWITCH_SIGNING_SECRET)
twitch event trigger streamup -F http://localhost:8888/webhooks/twitch -s $TWITCH_SIGNING_SECRET -t 114823831
