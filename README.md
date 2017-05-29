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

## Configuration

The following options may be overriden in the appropriate switch case statement.

- `debug` (Boolean) - Turns the application more verbose. Be careful with this option in production environments because printing to stdout is a synchronous operation.
- `sandbox` (Boolean) - If enabled, the application won't contact SparkPost and will simply acknowledge the received message.
- `amqp` (String) - The URL of your AMQP server.
- `queue` (String) - The name for the queue the application creates and uses.
- `messagePrefetch` (Integer) - How many messages sent over the channel can be awaiting acknowledgement.
- `sparkpost` (Object) - The SparkPost Nodemailer transport options. The only required property of this object is the `sparkPostApiKey`.

Whenever the `NODE_ENV` environment variable is `prod`, `production` or `staging`, the following values are read from environment variables by default:

|           Property          |   Environment Variable   |
|:---------------------------:|:------------------------:|
| `amqp`                      | `NMSP_AMQP_URL`          |
| `queue`                     | `NMSP_QUEUE_NAME`        |
| `debug`                     | `NMSP_DEBUG`             |
| `sandbox`                   | `NMSP_SANDBOX`           |
| `sparkpost.sparkPostApiKey` | `NMSP_SPARKPOST_API_KEY` |

**Note:** For the `NMSP_DEBUG` and `NMSP_SANDBOX` environment variables, only the existence of these variables are checked and the value is never used. As long as these variables have a value, their respective options will be set to `true`.

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
