#!/bin/bash
git pull
chmod a+x ./redeploy.sh
npx yarn install
npm run build