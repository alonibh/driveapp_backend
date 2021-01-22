# For testing only now
# Build containers

# Save app
docker save driveapp_backend_app:latest -o app.tar && tar cfz app.tar.gz app.tar && rm app.tar

# Upload to server

# At server
cd /root && docker-compose up -d
