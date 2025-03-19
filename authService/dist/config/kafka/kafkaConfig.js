"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kafkajs_1 = require("kafkajs");
const kafka = new kafkajs_1.Kafka({
    clientId: "auth-service",
    brokers: ['localhost:9092'],
    retry: {
        retries: 5,
        initialRetryTime: 300,
        multiplier: 2,
    },
});
exports.default = kafka;
