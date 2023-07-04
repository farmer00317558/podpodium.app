#!/usr/bin/env bash

set -e

yarn && PODIUM_API_BASE_URL=http://localhost:8080/api/v1 yarn build
tar -czvf podium-web-pkg.tar.gz \
    ./podium-web.service \
    ./.next \
    ./next.config.mjs \
    ./package.json \
    ./public \
    ./yarn.lock \
    ./.yarn \
    ./.yarnrc.yml \
    ./.pnp.cjs \
    ./.pnp.loader.mjs