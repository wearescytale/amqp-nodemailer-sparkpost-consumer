'use strict';

const nodemailer = require('nodemailer');
const sparkPostTransport = require('nodemailer-sparkpost-transport');
const configs = require('../configuration/configs');
const options = configs.sparkpost;

const transport = nodemailer.createTransport(sparkPostTransport(options), configs.emailDefaults);

module.exports = transport;
