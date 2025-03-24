"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kafkajs_1 = require("kafkajs");
const getBrokers = () => {
    const isProduction = process.env.NODE_ENV === 'production';
    const devBroker = process.env.KAFKA_DEV_BROKER || 'localhost:9092';
    const prodBroker = process.env.KAFKA_PROD_BROKER || 'kafka-service:9092';
    console.log(isProduction);
    return isProduction ? [prodBroker] : [devBroker];
};
const kafka = new kafkajs_1.Kafka({
    clientId: "notification-service",
    brokers: getBrokers(),
    retry: {
        retries: 5,
        initialRetryTime: 300,
        multiplier: 2,
    },
});
exports.default = kafka;
