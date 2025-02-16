FROM oven/bun:1
WORKDIR /app

# Copy and modify package.json first
COPY package*.json ./
RUN sed -i 's|file:../../typescript_sdk-preview|file:./hdr-sdk-preview-0.3.3.tgz|' package.json

# Then copy and install SDK
COPY hdr-sdk-preview-0.3.3.tgz ./
RUN bun install

COPY . .
RUN bunx prisma generate
RUN bunx prisma migrate deploy
EXPOSE $PORT
CMD ["bun", "src/index.ts"]