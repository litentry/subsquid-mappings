FROM node:16-alpine AS node

FROM node AS node-with-gyp
# RUN apk add g++ make python3

ARG PRAWN

FROM node-with-gyp AS builder
WORKDIR /squid
ADD package.json .
ADD yarn.lock .
ADD prawn-utils prawn-utils
ADD prawns/$PRAWN/package.json prawns/prawn/
RUN yarn install --pure-lockfile --non-interactive
ADD prawns/$PRAWN/tsconfig.json prawns/prawn/
ADD prawns/$PRAWN/src prawns/prawn/src
RUN cd prawns/prawn && yarn build

FROM node AS squid
WORKDIR /squid
COPY --from=builder /squid/prawns/prawn/package.json .
COPY --from=builder /squid/prawns/prawn/yarn.lock .
COPY --from=builder /squid/prawns/prawn/node_modules node_modules
COPY --from=builder /squid/prawns/prawn/lib lib
ADD prawns/$PRAWN/db prawns/prawn/db
ADD prawns/$PRAWN/schema.graphql prawns/prawn/
# TODO: use shorter PROMETHEUS_PORT
ENV PROCESSOR_PROMETHEUS_PORT 3000



FROM squid AS khalaProcessor
EXPOSE 3000
CMD ["cd prawns/prawn &&", "yarn", "process:khala"]

FROM squid AS kusamaProcessor
EXPOSE 3000
CMD ["cd prawns/prawn &&", "yarn", "process:kusama"]

FROM squid AS polkadotProcessor
EXPOSE 3000
CMD ["cd prawns/prawn &&", "yarn", "process:polkadot"]

FROM squid AS queryNode
EXPOSE 4002
CMD ["cd prawns/prawn &&", "yarn", "query-node"]

FROM squid AS migrate
RUN yarn add "@subsquid/cli"
CMD ["cd prawns/prawn &&", "yarn", "migrate"]