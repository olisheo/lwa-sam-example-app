#!/bin/bash
set -eu
CONFIG_FILE="./.upload.config"

[ -f "$CONFIG_FILE" ] || {
    echo "endpoint-config.js file is needed. please check endpoint-config.js.sample"
    exit 1
}

# shellcheck source=.upload.sh
source "$CONFIG_FILE"

files=(index.html codegrant.html)
for file in "${files[@]}"; do
    echo "$file"
    aws s3api put-object --acl public-read --bucket "${S3BUCKET}" --content-type text/html --key "${file}" --body "${file}" --profile "${AWS_PROFILE}"
done

jsfiles=(endpoint-config.js)
for jsfile in "${jsfiles[@]}"; do
    echo "$jsfile"
    aws s3api put-object --acl public-read --bucket "${S3BUCKET}" --content-type text/javascript --key "${jsfile}" --body "${jsfile}" --profile "${AWS_PROFILE}"
done
