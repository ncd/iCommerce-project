#!/bin/bash

hostname=$(minikube service kong-admin -n kong --url)

# Set up route for product service
curl --location --request POST "${hostname}/services/" \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "products",
    "host": "product-service.service.svc.cluster.local",
    "port": 8080
}'

curl --location --request POST "${hostname}/services/products/routes" \
--header 'Content-Type: application/json' \
--data-raw '{
    "paths": ["/api/products"]
}'

curl --location --request POST "${hostname}/services/" \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "queries",
    "host": "query-service.service.svc.cluster.local",
    "port": 8080
}'

curl --location --request POST "${hostname}/services/queries/routes" \
--header 'Content-Type: application/json' \
--data-raw '{
    "paths": ["/api/queries"]
}'

curl --location --request POST "${hostname}/services/" \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "views",
    "host": "view-service.service.svc.cluster.local",
    "port": 8080
}'

curl --location --request POST "${hostname}/services/views/routes" \
--header 'Content-Type: application/json' \
--data-raw '{
    "paths": ["/api/views"]
}'