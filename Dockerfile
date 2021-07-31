FROM denoland/deno:1.11.5

EXPOSE 19974

WORKDIR /app

USER deno

COPY deps.ts .
RUN deno cache deps.ts

ADD . .

RUN deno cache server.ts

CMD ["run", "-A", "main.ts"]
