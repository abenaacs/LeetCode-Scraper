# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application (if necessary)
RUN npm run build

# Expose any necessary ports (if applicable)
EXPOSE 3000

# Define the command to run the app
CMD ["npm", "start"]
