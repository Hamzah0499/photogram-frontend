FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_PUBLIC_BACKEND_API_URL=http://localhost:5000/api/v1

# Expose the development port
EXPOSE 3000

# Run in development mode
CMD ["npm", "run", "dev"]