# Lighthouse Runner

Run Chrome Lighthouse against your application in a docker container

# Usage

Check out the `examples` directory to see an example docker-compose files that can be used to run a container from the image against a containerized web application. You can provide a `SUT_URL` environment variable to the lighthouse container to find your running application. A simple wait-for-it script will ensure that your application is responding with a 200 HTTP status code before lighthouse begins.

```yml
version: "3.3"
services:
  lighthouse:
    # build:
    #  context: ./../src
    #  dockerfile: Dockerfile
    # image: lighthouse-image
    # container_name: lighthouse-container
    image: <this-lighthouse-image>
    network_mode: "host"
    command: ["bash"]
    environment:
      - SUT_URL=http://localhost:8000
  sut:
    image: <my-application-to-test-image>
    ports:
      - "8000:8000"
```
