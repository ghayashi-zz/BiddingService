# BiddingService

API Developed in Node.js + Express + MongoDB

# Services

POST /auction               : Create Auction
PATCH /auction/:auctionID   : Update Auction
GET /auction/:auctionID     : Get Auction
GET /auction/all            : List Auctions
POST /bid                   : Create Bid

## Examples

**POST /auction**

```curl
curl -X POST \
  http://127.0.0.1:3030/auction \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json'
  -d '{
	"item": "",
	"description": "",
	"email": "",
	"startingPrice": ,
	"startTime": "",
	"endTime": ""
}'
```

**GET /auction/:auctionID**
```curl
curl -X GET \
  http://127.0.0.1:3030/auction/:auctionID \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json'
```

**GET /auction/all**
```curl
curl -X GET \
  http://127.0.0.1:3030/auction/all \
  -H 'Content-Type: application/json'
```

> You can use pagination in this service
> Setting **limit** and **offset** as integer values
```curl
curl -X GET \
  http://127.0.0.1:3030/auction/all?limit=10&offset=5 \
  -H 'Content-Type: application/json'
```

**PATCH /auction/:auctionID**
```curl
curl -X PATCH \
  http://127.0.0.1:3030/auction/:auctionID \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json'
  -d '{
	"status": ""
}'
```

Status should accept the following values:
> pending
> ongoing
> finished

**POST /bid**
```curl
curl -X POST \
  http://127.0.0.1:3030/bid \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json'
  -d '{
	"email": "",
	"amount": ,
	"auctionID": ""
}'
```

**GET /bid**
```curl
curl -X GET \
  http://127.0.0.1:3030/bid/ \
  -H 'Content-Type: application/json'
```


# Background Services

Cron service to update auctions:

- Auction ongoing
- Auction finished

# Tests

https://documenter.getpostman.com/view/255918/RztfwBuS

# How to Run

## Local environment

1. Install Node
2. Install Npm
3. Install Mongo
4. Run npm install
5. Run npm start

## Docker enviroment

1. Install Docker
2. Install Docker-Compose
3. Run docker-compose up

## Remote

Use the IP as endpoint:157.230.220.226 on port 3030.
The services are online and available

If you have any errors please let me know !
