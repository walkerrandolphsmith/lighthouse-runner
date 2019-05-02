#!/usr/bin/env bash

function build() {
  docker-compose -f docker-compose.yml build lighthouse
}

function up() {
  echo "statrting service"
   docker-compose \
      -f docker-compose.yml \
      up --exit-code-from "lighthouse"
}

function down() {
  docker-compose -f docker-compose.yml down lighthouse
}

function destroy() {
  docker-compose -f docker-compose.yml down --rmi all
}

command=$1

case $command in
    build)
        build
        ;;
    destroy)
        destroy
        ;;
    up)
        up
        ;;
    down)
        down
        ;;
    *)
        echo "Option not recognized."
        exit 1
esac