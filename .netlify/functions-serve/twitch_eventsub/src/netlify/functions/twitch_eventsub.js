var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// netlify/functions/twitch_eventsub.js
__export(exports, {
  handler: () => handler
});

// netlify/lib/withVerifyTwitch.js
var import_crypto = __toModule(require("crypto"));
var twitchSigningSecret = process.env.TWITCH_SIGNING_SECRET;
var withVerifyTwitch = (handler2) => {
  return async (event, context) => {
    const messageId = event.headers["twitch-eventsub-message-id"];
    const timestamp = event.headers["twitch-eventsub-message-timestamp"];
    const messageSignature = event.headers["twitch-eventsub-message-signature"];
    const time = Math.floor(new Date().getTime() / 1e3);
    if (!twitchSigningSecret) {
      console.log(`Twitch signing secret is empty.`);
      return { statusCode: 422, body: "Signature verification failed." };
    }
    if (Math.abs(time - timestamp) > 600) {
      console.log(`Verification Failed: timestamp > 10 minutes. Message Id: ${messageId}.`);
      return { statusCode: 422, body: "Ignore this request." };
    }
    const computedSignature = "sha256=" + import_crypto.default.createHmac("sha256", twitchSigningSecret).update(messageId + timestamp + event.body).digest("hex");
    if (messageSignature !== computedSignature) {
      console.log(`Provided signature does not match computed signature.`);
      console.log(`Message ${messageId} Signature: `, messageSignature);
      console.log(`Message ${messageId} Computed Signature: ${computedSignature}`);
      return { statusCode: 422, body: "Signature verification failed." };
    }
    return handler2(event, context);
  };
};
var withVerifyTwitch_default = withVerifyTwitch;

// netlify/functions/twitch_eventsub.js
async function twitchHandler(event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { Allow: "POST" },
      body: "Method Not Allowed"
    };
  }
  const body = JSON.parse(event.body);
  const messageType = event.headers["twitch-eventsub-message-type"];
  if (messageType === "webhook_callback_verification") {
    return {
      statusCode: 200,
      body: body.challenge
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello World" })
  };
}
var handler = withVerifyTwitch_default(twitchHandler);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=twitch_eventsub.js.map
