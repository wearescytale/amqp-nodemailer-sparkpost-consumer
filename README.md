# AMQP Nodemailer Consumer for SparkPost

## Introduction

This is a simple consumer for a messaging queue system (using the AMQP protocol) already setup for use with a nodemailer transport for SparkPost.

## Requirements

- An MQ server (ActiveMQ, RabbitMQ, etc)
- Node 7.10.0

## Installation

Clone this repository and run:
```
yarn && npm start
```

To run in production you can simply run:
```
npm run start:production
```
