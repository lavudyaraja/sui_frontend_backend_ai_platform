@echo off
echo Starting MongoDB with Docker...
docker run -d -p 27017:27017 --name sui_dat_mongodb mongo:latest
echo MongoDB is now running on port 27017
echo To stop MongoDB, run: docker stop sui_dat_mongodb