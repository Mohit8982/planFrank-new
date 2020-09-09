FROM node:10-alpine
ENV NODE_ENV production
ENV PORT 5000

# Set TimeZone correctly
ENV TZ=Asia/Kolkata
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone


# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install
RUN cat /etc/hosts
# Bundle app source
COPY . /usr/src/app
EXPOSE 5000
CMD [ "npm", "start" ] 
