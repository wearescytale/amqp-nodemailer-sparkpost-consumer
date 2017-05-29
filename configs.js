'use strict';

module.exports = function() {
    this.amqp = 'amqp://localhost';
    this.queue = 'nodemailer-sparkpost-amqp';

    switch(process.env.NODE_ENV) {
        case 'prod':
        case 'production':
            this.amqp = '$YOUR_AMQP_SERVER_URL';
            this.queue = '$YOUR_QUEUE_NAME';

            break;
        case 'dev':
        case 'develop':
        case 'development':
            break;
    }
};
