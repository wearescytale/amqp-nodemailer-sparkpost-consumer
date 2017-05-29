'use strict';

const amqp = require('amqplib');
const Configs = require('configs');

const configs = new Configs();
const q = configs.queue;

amqp.connect(configs.amqp)
.then((conn) => {
    return conn.createChannel();
})
.then((ch) => {
    return ch.assertQueue(q, {
        durable: true
    })
    .then((ok) => {
        return ch.prefetch(1);
    })
    .then((ok) => {
        console.log(`[${q}] Waiting for messages to process. To exit press CTRL+C`);

        return ch.consume(q, (msg) => {
           if (msg !== null) {
               console.log(msg.content.toString());
               ch.ack(msg);
           }
        });
    })
})
.catch(console.warn);
