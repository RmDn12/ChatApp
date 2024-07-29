/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import { onRequest } from "firebase-functions/v2/https";
import logger from "firebase-functions/logger";

import { firestore } from "firebase-functions";
import Filter from "content-filter";

import { initializeApp, firestore as _firestore } from "firebase-admin";
initializeApp();

const db = _firestore();

export const detectProfanity = firestore
  .document("messages/{messageId}")
  .onCreate(async (snap, context) => {
    const filter = new Filter();
    const { text, uid } = doc.data();

    if (filter.isProfane(text)) {
      const cleaned = filter.clean(text);
      await doc.ref.update({
        text: "I was naughty and tried to say: " + cleaned,
      });
      await db.collection("profanity").doc(uid).set({});
    }
  });
