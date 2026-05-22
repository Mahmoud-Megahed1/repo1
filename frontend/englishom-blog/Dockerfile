# ============================================================================
# EnglishOM Blog System - Multi-Stage Dockerfile
# ============================================================================
# This Dockerfile builds a production-ready Docker image for the EnglishOM Blog
# Stages: Build (compile TypeScript) -> Runtime (minimal image)
# ============================================================================

# ============================================================================
# Stage 1: Build Stage
# ============================================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# ============================================================================
# Stage 2: Runtime Stage
# ============================================================================
FROM node:22-alpine

WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache curl

# Copy package files from builder
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./

# Install production dependencies only
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile --prod

# Copy built application from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/client ./client
COPY --from=builder /app/drizzle ./drizzle

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership to nodejs user
RUN chown -R nodejs:nodejs /app

# Switch to nodejs user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Start the application
CMD ["node", "dist/index.js"]

# ============================================================================
# BUILD INSTRUCTIONS
# ============================================================================
#
# Build the image:
#   docker build -t englishom-blog:latest .
#
# Run the container:
#   docker run -d \
#     -p 3000:3000 \
#     --name englishom-blog \
#     -e DATABASE_URL="mysql://user:pass@db:3306/englishom_blog" \
#     -e JWT_SECRET="your_secret_here" \
#     englishom-blog:latest
#
# ============================================================================
