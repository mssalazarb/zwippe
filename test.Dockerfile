# Base image
FROM node:fermium as intermediate
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
# Install app dependencies `npm install
RUN npm ci

# Base image for start the server
FROM node:fermium-alpine
# Create the work directory
RUN mkdir -p /usr/src/app
# Set the work directory
WORKDIR /usr/src/app
# Bundle app source

COPY . /usr/src/app
# Bundle app source
COPY --from=intermediate ./node_modules ./node_modules
# Set timezone UTC

ENV TZ UTC
