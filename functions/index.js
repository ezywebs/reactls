'use strict';
const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const stripe = require('stripe')(functions.config().stripe.testkey);

exports.stripeCharge = functions.database
                                .ref('/payments/{userId}/{paymentId}')
                                // .onWrite(event => {
                                .onWrite((change,context) => {
                                  const payment = change.after.val();
                                  const userId = context.params.userId;
                                  const paymentId = context.params.paymentId;
                                  
                                  if (!payment || payment.charge) return;
                                  
                                  return admin.database()
                                              .ref(`/users/${userId}`)
                                              .once('value')
                                              .then(snapshot => {
                                                return snapshot.val();
                                              })
                                              .then(customer => {
                                                const amount = payment.amount;
                                                const idempotency_key = paymentId;
                                                const source = payment.token.id;
                                                const currency = 'usd';
                                                const charge = {amount, currency, source};
                                                
                                                return stripe.charges.create(charge, { idempotency_key });
                                              })
                                              .then(charge => {
                                                admin.database()
                                                    .ref(`/payments/${userId}/${paymentId}/charge`)
                                                    .set(charge);
                                                return true;
                                              })
                                });
                              


// const currency = functions.config().stripe.currency || 'USD';
// const logging = require('@google-cloud/logging');

// create Stripe user on sign up
exports.createStripeCustomer = functions.auth
    .user().onCreate(user => {
      return stripe.customers.create({
          email: user.email
      })
      .then(customer => {
          const updates = {}
           
          // updates[`/customers/${customer.id}`]     = user.id
          updates[`/users/${user.uid}/customerId`] = customer.id
           
          return admin.database().ref().update(updates)
      });
    });

// When a user is created, register them with Stripe
// exports.createStripeCustomer = functions.auth
//   .user().onCreate(user => {
//     const customer = stripe.customers.create({email: user.email});
//     return admin.firestore().collection('stripe_customers').doc(user.uid).set({customer_id: customer.id});
//   });

// [START chargecustomer]
// Charge the Stripe customer whenever an amount is written to the Realtime database
// exports.createStripeCharge = functions.firestore.document('stripe_customers/{userId}/charges/{id}').onCreate(async (snap, context) => {
//       const val = snap.data();
//       try {
//         // Look up the Stripe customer id written in createStripeCustomer
//         const snapshot = await admin.firestore().collection(`stripe_customers`).doc(context.params.userId).get()
//         const snapval = snapshot.data();
//         const customer = snapval.customer_id
//         // Create a charge using the pushId as the idempotency key
//         // protecting against double charges
//         const amount = val.amount;
//         const idempotencyKey = context.params.id;
//         const charge = {amount, currency, customer};
//         if (val.source !== null) {
//           charge.source = val.source;
//         }
//         const response = await stripe.charges.create(charge, {idempotency_key: idempotencyKey});
//         // If the result is successful, write it back to the database
//         return snap.ref.set(response, { merge: true });
//       } catch(error) {
//         // We want to capture errors and render them in a user-friendly way, while
//         // still logging an exception with StackDriver
//         console.log(error);
//         await snap.ref.set({error: userFacingMessage(error)}, { merge: true });
//         return reportError(error, {user: context.params.userId});
//       }
//     });
// [END chargecustomer]]
// exports.createStripeCharge = functions.firestore.document('stripe_customers/{userId}/charges/{id}').onCreate((snap, context) => {
//       const val = snap.data();
//       try {
//         // Look up the Stripe customer id written in createStripeCustomer
//         const snapshot = admin.firestore().collection(`stripe_customers`).doc(context.params.userId).get()
//           .then(response => {
//             const snapval = response.data();
//             const customer = snapval.customer_id
//             // Create a charge using the pushId as the idempotency key
//             // protecting against double charges
//             const amount = val.amount;
//             const idempotencyKey = context.params.id;
//             const charge = {amount, currency, customer};
//             if (val.source !== null) {
//               charge.source = val.source;
//             }
//             stripe.charges.create(charge, {idempotency_key: idempotencyKey}).then(response => {
//               // If the result is successful, write it back to the database
//               return snap.ref.set(response, { merge: true });
//             })
//           })
//       } catch(error) {
//         // We want to capture errors and render them in a user-friendly way, while
//         // still logging an exception with StackDriver
//         console.log(error);
//         snap.ref.set({error: userFacingMessage(error)}, { merge: true }).then(response => {
//           return reportError(error, {user: context.params.userId});
//         })
//       }
//     });


// To keep on top of errors, we should raise a verbose error report with Stackdriver rather
// than simply relying on console.error. This will calculate users affected + send you email
// alerts, if you've opted into receiving them.
// [START reporterror]
// function reportError(err, context = {}) {
//   // This is the name of the StackDriver log stream that will receive the log
//   // entry. This name can be any valid log stream name, but must contain "err"
//   // in order for the error to be picked up by StackDriver Error Reporting.
//   const logName = 'errors';
//   const log = logging.log(logName);

//   // https://cloud.google.com/logging/docs/api/ref_v2beta1/rest/v2beta1/MonitoredResource
//   const metadata = {
//     resource: {
//       type: 'cloud_function',
//       labels: {function_name: process.env.FUNCTION_NAME},
//     },
//   };

//   // https://cloud.google.com/error-reporting/reference/rest/v1beta1/ErrorEvent
//   const errorEvent = {
//     message: err.stack,
//     serviceContext: {
//       service: process.env.FUNCTION_NAME,
//       resourceType: 'cloud_function',
//     },
//     context: context,
//   };

//   // Write the error log entry
//   return new Promise((resolve, reject) => {
//     log.write(log.entry(metadata, errorEvent), (error) => {
//       if (error) {
//       return reject(error);
//       }
//       return resolve();
//     });
//   });
// }
// [END reporterror]

// Sanitize the error message for the user
// function userFacingMessage(error) {
//   return error.type ? error.message : 'An error occurred, developers have been alerted';
// }


