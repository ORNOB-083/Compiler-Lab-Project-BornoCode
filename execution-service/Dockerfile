# BornoCode execution service image.
# Build from the repo root:
#   docker build -f execution-service/Dockerfile -t bornocode-exec .
# Run:
#   docker run --rm -p 8080:8080 --read-only --cap-drop ALL \
#     --security-opt no-new-privileges --memory 128m --cpus 0.5 \
#     --pids-limit 32 bornocode-exec

# ---- Stage 1: compile the interpreter (static, no runtime deps) ----
FROM debian:bookworm-slim AS build
RUN apt-get update && apt-get install -y --no-install-recommends g++ \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /src
COPY interpreter/bornocode.cpp interpreter/bornocode.h ./
RUN g++ -std=c++17 -O2 -static bornocode.cpp -o bornocode

# ---- Stage 2: tiny runtime with the Node runner ----
FROM node:20-alpine
WORKDIR /app
COPY execution-service/server.mjs ./
COPY --from=build /src/bornocode ./bornocode
ENV PORT=8080 BORNOCODE_BIN=/app/bornocode
EXPOSE 8080
USER node
CMD ["node", "server.mjs"]
