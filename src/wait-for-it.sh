#!/usr/bin/env bash

if [ -z "$SUT_URL" ]; then
  echo "The url of the application under test is required"
  exit 1
fi

echo "URL: $SUT_URL"

attempt_counter=0
max_attempts=10
exit_code=1

while [[ $attempt_counter -le $max_attempts ]]
do
  status_code=$(curl -kso /dev/null -I -w "%{http_code}" $SUT_URL)
  if [[ "$status_code" -eq 200 ]] ; then
    exit_code=0
    break
  fi
  echo "$status_code from $SUT_URL"
  attempt_counter=$(($attempt_counter+1))
  sleep 1
done

echo "Exit Code: $exit_code"

if [[ "$exit_code" -ne "0" ]] ; then
    exit 1
fi

node ./index.js
