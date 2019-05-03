#!/usr/bin/env bash

function install() {
  docker-compose \
    -f example/docker-compose-sut.yml \
    -f example/docker-compose.yml \
    build
}

function uninstall() {
  docker-compose \
    -f example/docker-compose-sut.yml \
    -f example/docker-compose.yml \
    down --rmi all
}

function up() {
   docker-compose \
      -f example/docker-compose-sut.yml \
      -f example/docker-compose.yml \
      up --exit-code-from "lighthouse"
}

function down() {
  docker-compose \
    -f example/docker-compose-sut.yml \
    -f example/docker-compose.yml \
    down
}


command=$1

case $command in
    install)
        install
        ;;
    uninstall)
        uninstall
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