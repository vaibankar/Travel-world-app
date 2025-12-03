FROM node:18-alpine AS builder
 
# Set working directory
WORKDIR /app
 
# Copy package files
COPY package*.json ./
 
# Install dependencies
RUN npm install
 
# Copy source code
COPY . .
 
# Build the Vite application
RUN npm run build
 
# Stage 2: Production server
FROM node:18-alpine
 
# Set working directory
WORKDIR /app
 
# Copy package files
COPY package*.json ./
 
# Install only production dependencies
RUN npm install --only=production
 
# Copy built files from builder stage
COPY --from=builder /app/dist ./dist
 
# Copy server file
COPY server.js ./
 
# Expose the application port
EXPOSE 3000
 

# Start the server
CMD ["node", "server.js"]

