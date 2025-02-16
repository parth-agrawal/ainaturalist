FROM oven/bun:1
WORKDIR /app
COPY package*.json ./
COPY hdr-sdk-preview-0.3.3.tgz ./
RUN bun install ./hdr-sdk-preview-0.3.3.tgz
RUN bun install
COPY . .
RUN bunx prisma generate
EXPOSE $PORT
CMD ["bun", "src/index.ts"]