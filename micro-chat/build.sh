#!/bin/sh

npm run build && sudo docker build -t micro-chat-front .