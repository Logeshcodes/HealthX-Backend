"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dependencyInjector_1 = require("../config/dependencyInjector");
const express_1 = require("express");
let router = (0, express_1.Router)();
router.post('/login', dependencyInjector_1.adminController.login.bind(dependencyInjector_1.adminController));
router.post('/logout', dependencyInjector_1.adminController.logout.bind(dependencyInjector_1.adminController));
const adminRoutes = router;
exports.default = adminRoutes;
