'use strict';

const Config = function() {
    this.debug = true; // Be more verbose
    this.sandbox = true; // Will not make true requests to SparkPost

    this.amqp = 'amqp://localhost';
    this.queue = 'nodemailer-sparkpost';
    this.messagePrefetch = 1;
    this.sparkpost = {
        sparkPostApiKey: ''
    };

    switch(process.env.NODE_ENV) {
        case 'prod':
        case 'production':
        case 'staging':
            this.amqp = process.env.NMSP_AMQP_URL;
            this.queue = process.env.NMSP_QUEUE_NAME;
            this.debug = !!process.env.NMSP_DEBUG;
            this.sandbox = !!process.env.NMSP_SANDBOX;
            this.sparkpost.sparkPostApiKey = process.env.NMSP_SPARKPOST_API_KEY;

            break;
        case 'dev':
        case 'develop':
        case 'development':
            break;
    }
};

module.exports = new Config();
