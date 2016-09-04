# Use the base App Engine Docker image, based on debian jessie.
FROM gcr.io/google_appengine/nodejs

# Install updates
RUN apt-get update

# Install dependencies
RUN apt-get install -y \
  libgtk2.0-0 \
  libgconf-2-4 \
  libasound2 \
  libxtst6 \
  libxss1 \
  libnss3 \
  xvfb

# Clean aptitude
RUN apt-get clean

# Install node.js 4.5.0
RUN install_node v4.5.0

# Copy code to working directory
COPY . /app/

# Install npm dependencies
RUN npm install --unsafe-perm || \
  ((if [ -f npm-debug.log ]; then \
    cat npm-debug.log; \
  fi) && false)

# Entrypoint to initialize display
COPY entrypoint /
RUN chmod +x /entrypoint
ENTRYPOINT ["/entrypoint"]

# Open our default port
EXPOSE 8080

# Start up
CMD npm start
