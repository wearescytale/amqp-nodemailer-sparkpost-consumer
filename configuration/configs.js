'use strict';

const Config = function() {
    this.debug = true; // Be more verbose
    this.sandbox = true; // Will not make true requests to SparkPost

    this.amqp = 'amqp://localhost';
    this.queue = 'nodemailer-sparkpost';
    this.messagePrefetch = 1;
    this.sparkpost = {
        // sparkPostApiKey: '',
        // campaign_id: {},
        // metadata: {},
        // options: {},
        // substitution_data: {}
    };

    switch(process.env.NODE_ENV) {
        case 'prod':
        case 'production':
            this.amqp = '$YOUR_AMQP_SERVER_URL';
            this.queue = '$YOUR_QUEUE_NAME';
            this.debug = false;
            this.sandbox = false;

            break;
        case 'dev':
        case 'develop':
        case 'development':
            break;
    }
};

module.exports = new Config();
