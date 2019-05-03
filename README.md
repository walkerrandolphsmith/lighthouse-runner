# Lighthouse Runner

Run Chrome Lighthouse against your application in a docker container

# Usage

Check out the `examples` directory to see an example docker-compose files that can be used to run a container from the image against a containerized web application. You can provide a `SUT_URL` environment variable to the lighthouse container to find your running application. A simple wait-for-it script will ensure that your application is responding with a 200 HTTP status code before lighthouse begins.

Given the following docker-compose you can leverage the `--exit-code-from` flag of `docker-compose up` to inherit the exit code of a specific service. Therefore if lighthouse fails then the docker-compose command fails.

```sh
 docker-compose \
      -f example/docker-compose.yml \
      up --exit-code-from "lighthouse"
```

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
      - VERBOSE=true
      - SILENT=false
  sut:
    image: <my-application-to-test-image>
    ports:
      - "8000:8000"
```

# Logging

`VERBOSE` environment variable can be used to get the most logging from lighthouse audit.
`SILENT` enviornment variable can be used to remove all logging.

# Limitations

Currently there is no way to configure thresholds on lighthouse categories. If your application does not meet 100% in each category then it is considered a failure.

Currently there is no way to inject desired chrome flags to be used by lighthouse as part of the configuration.
