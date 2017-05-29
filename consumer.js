'use strict';

const configs = require('./configuration/configs');
const connection = require('amqplib').connect(configs.amqp);
const transport = require('./transports/sparkpost');

const q = configs.queue;
const DEBUG = configs.debug;
const SANDBOX = configs.sandbox;

const DEBUG_STRING = '\x1b[34m[DEBUG]\x1b[0m';
const SANDBOX_STRING = '\x1b[35m[SANDBOX]\x1b[0m';

DEBUG && console.warn(DEBUG_STRING, 'You\'re running in debug mode.');
SANDBOX && console.warn(SANDBOX_STRING, 'You\'re running in Sandbox mode. The SparkPost response will be mocked.');

// Connect the AMQP client
connection.then((conn) => {
    // After a successful connection, create a channel
    // The channel is where we'll be able to make all of the API calls we need
    return conn.createChannel();
})
.then((ch) => {
    // Assert the idempotent queue as durable
    // This means the queue will not be lost after crashes or restarts
    return ch.assertQueue(q, {
        durable: true
    })
    .then((ok) => {
        // This will make sure our consumer will always be working
        return ch.prefetch(configs.messagePrefetch);
    })
    .then((ok) => {
        // Announce the successful channel connection
        console.log(`\x1b[32m[${q}]\x1b[0m Waiting for messages to process. To exit press CTRL+C`);

        // This is where our processing will take place
        // The ch#consume callback is called whenever our consumer received
        //  a message to process
        return ch.consume(q, (msg) => {
           if (msg !== null) {
                DEBUG && console.log(`${DEBUG_STRING}\x1b[32m[${q}]\x1b[0m Received message, consuming...`);
                DEBUG && console.log(`${DEBUG_STRING}\x1b[32m[${q}]\x1b[0m Content:`, msg.content.toString());

                let message = JSON.parse(msg.content.toString());

                if (SANDBOX) {
                    setTimeout(() => {
                        ch.ack(msg);
                        console.log(`${SANDBOX_STRING}\x1b[32m[${q}]\x1b[0m Acknowledged message.`);
                        return;
                    }, 500);
                } else {
                    transport.sendMail(message)
                    .then((ok) => {
                        // Acknowledge the message, making it safe for the
                        //  message queue to delete it.
                        ch.ack(msg);
                        DEBUG && console.log(`${DEBUG_STRING}\x1b[32m[${q}]\x1b[0m Acknowledged message ${ok.messageId} sent to ${message.to}`);
                    })
                    .catch((err) => {
                        console.error(`\x1b[31m[ERROR]\x1b[32m[${q}]\x1b[0m ${JSON.stringify(err)}`);

                        // Nacking a rejected message will re-add to the queue, however,
                        //  we've defined false for the 'requeue' argument because we don't want
                        //  failed emails to keep retrying.
                        // For reference: #nack(message, [allUpTo, [requeue]])
                        ch.nack(msg, false, false);
                        DEBUG && console.log(`${DEBUG_STRING}\x1b[32m[${q}]\x1b[0m Nacked message. Receiver: ${message.to}`);
                    });
                }
           }
        }, { noAck: false });
    });
})
// Print out a warning in case of errors.
// You can expand this catch statement to include any error reporting
//  you might need.
.catch((err) => {
    console.error('\x1b[31m', err, '\x1b[0m');
});
