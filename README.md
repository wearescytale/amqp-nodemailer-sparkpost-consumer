# AMQP Nodemailer Consumer for SparkPost

## Introduction

This is a simple consumer for a messaging queue system (using the AMQP protocol) already setup for use with a nodemailer transport for SparkPost.

## Requirements

- Node 7.10.0
- An MQ server (ActiveMQ, RabbitMQ, etc)
- SparkPost API key

## Installation

Clone this repository and run `yarn`.

Be sure to fill in your details in the `configuration/configs.js` file then run `npm start`.

To run in production you can simply run:
```
npm run start:production
```

For a development environment (automatic restarts upon file changes) run:
```
npm run start:dev
```

## Adding emails to the queue

You can test sending emails through the message queue by adding the following code to the bottom of `consumer.js` and running `npm run start:dev`

Be sure to have a SparkPost API key setup in the `configuration/configs.js` file.

```javascript
/**
    Provider
 */

// Reuse the pre-existing connection
connection.then((conn) => {
    // Create a new channel
    return conn.createChannel();
})
.then((ch) => {
    // Make sure the queue exists.
    return ch.assertQueue(q, {
        durable: true
    })
    .then((ok) => {
        // Build a transport message
        let message = {
            from: '"Sender" <sender@example.com>',
            to: '"Receiver" <receiver@example.com>',
            subject: 'Example Subject',
            text: 'Example Text',
            html: '<h1>Example Rich Text</h1>'
        };

        // Send it to the message queue as a buffer.
        // #sendToQueue accepts an optional callback to check if the
        //  message was acked or nacked
        return ch.sendToQueue(q, Buffer.from(JSON.stringify(message)), {
            persistent: true,
            contentType: 'application/json'
        }, (err, ok) => {
            if (!err) {
                console.log('Message Acked!');
            } else {
                console.log('Message Nacked!');
            }
        });
    });
})
.catch(console.error);
```
