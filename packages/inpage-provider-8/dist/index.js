"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shimWeb3 = exports.setGlobalProvider = exports.MetaMaskInpageProvider = exports.initializeProvider = void 0;
const MetaMaskInpageProvider_1 = __importDefault(require("./MetaMaskInpageProvider"));
exports.MetaMaskInpageProvider = MetaMaskInpageProvider_1.default;
const initializeProvider_1 = require("./initializeProvider");
Object.defineProperty(exports, "initializeProvider", { enumerable: true, get: function () { return initializeProvider_1.initializeProvider; } });
Object.defineProperty(exports, "setGlobalProvider", { enumerable: true, get: function () { return initializeProvider_1.setGlobalProvider; } });
const shimWeb3_1 = __importDefault(require("./shimWeb3"));
exports.shimWeb3 = shimWeb3_1.default;
//# sourceMappingURL=index.js.map