#!/bin/bash

cd /home/node/dynpages-client
npm i --legacy-peer-deps
npm run start

# precisa converter os caracteres de final de linha usando
# dos2unix ./.docker/entrypoint.sh
# chmod +x ./.docker/entrypoint.sh
