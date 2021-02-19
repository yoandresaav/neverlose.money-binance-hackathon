git push && git pull && yarn && GENERATE_SOURCEMAP=true yarn build &&
node deploy/upload-source-maps.js  && # will delete all map files before upload

TIMESTAMP=`date +%Y-%m-%d-%H-%M-%S` &&
ssh neverlose "mkdir -p /srv/web/bsc-test.neverlose/releases/$TIMESTAMP"  &&
scp -r build/* neverlose:/srv/web/bsc-test.neverlose/releases/$TIMESTAMP/  &&
ssh neverlose "rm /srv/web/bsc-test.neverlose/current;ln -s /srv/web/bsc-test.neverlose/releases/$TIMESTAMP /srv/web/bsc-test.neverlose/current" &&
echo "-------\nDeploy completed successfully on $TIMESTAMP"
