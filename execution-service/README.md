# BornoCode execution service

A standalone, container-friendly runner for the BornoCode interpreter. It
accepts the same request/response contract as the website's `/api/execute`
route, so it can be dropped in front of the Next.js app for real sandboxing.

## API

```
GET  /health    -> { "ok": true }
POST /execute   { "source": "<BornoCode>", "stdin": "<optional>" }
```

Response:

```json
{
  "success": true,
  "stdout": "...",
  "stderr": "",
  "error": null,
  "exitCode": 0,
  "executionTimeMs": 18
}
```

## Run locally (for development)

```bash
npm run build:interpreter          # produces interpreter/bin/bornocode(.exe)
node execution-service/server.mjs  # listens on :8080
```

Point the website at it by setting `BORNOCODE_URL` (see below) — or just call
`POST http://localhost:8080/execute` directly.

## Run in Docker (production)

```bash
docker build -f execution-service/Dockerfile -t bornocode-exec .
docker run --rm -p 8080:8080 \
  --read-only --cap-drop ALL \
  --security-opt no-new-privileges \
  --memory 128m --cpus 0.5 --pids-limit 32 \
  bornocode-exec
```

The image compiles the interpreter statically inside the build stage, so the
runtime image contains only `node:20-alpine`, `server.mjs` and a single static
`bornocode` binary — no compiler, no shells needed by the payload.

## Connect the website to it

Set `BORNOCODE_URL` on the Next.js app:

```bash
BORNOCODE_URL=http://bornocode-exec:8080 npm run dev
```

When `BORNOCODE_URL` is set, `/api/execute` forwards requests to the service
instead of spawning the local binary. All size limits, timeouts and rate
limiting still apply at the Next.js layer; the service enforces its own limits
too, so it is safe to expose only to the web tier (never publicly).

## Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `8080` | Listen port |
| `BORNOCODE_BIN` | `./bornocode(.exe)` | Interpreter binary path |
| `MAX_SOURCE_BYTES` | `20000` | Max source size |
| `MAX_STDIN_BYTES` | `4000` | Max stdin size |
| `MAX_OUTPUT_BYTES` | `64000` | Max captured output |
| `TIMEOUT_MS` | `5000` | Per-run timeout |
