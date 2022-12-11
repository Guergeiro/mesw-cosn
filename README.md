# mesw-cosn

FEUP-MESW0013-2022/2023-1S

## Project

This project is being developed at
[GitHub](https://github.com/Guergeiro/mesw-cosn). If you want to create an
issue, please do it
[there](https://github.com/Guergeiro/mesw-cosn/issues/new/choose).

### Deployment

Deployment of each serverless function is made to [Cloudflare Workers](https://workers.cloudflare.com/).

Databases are corresponding REST APIs are deployed to
[Railway](https://railway.app/).

### OpenAPI

We use the code itself to generate dynamic OpenAPI 3.0 compliant specification.
Each function contains an endpoint that spits the specification either as _JSON_
or _YAML_, depending on the _Content-Type_ of the _Accept_ header of the
request. By default, if no _Accept_ header is passed, _JSON_ will be used. To
get _YAML_, use `text/yaml` _Content-Type_.

## Requirements

### For running in local mode

This project was always made to be able to be run in any environment. For that,
we use [Docker Engine](https://docs.docker.com/engine/). For ease of use, a
[Docker Compose](https://docs.docker.com/compose/) is create which can be used
for a quick spin up of the project.

### For development

Because of the nature of this monorepo, workspaces are required. For this
reason, [pnpm](https://pnpm.io) will be used. Check out the people who use it
[here](https://pnpm.io/workspaces#usage-examples)
