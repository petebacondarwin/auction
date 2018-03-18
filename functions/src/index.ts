import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


export const countItemsPerCategory = functions.firestore.document('items/{itemId}').onWrite(async action => {
  const category = action.data.get('category');
  const db = admin.firestore();
  const querySnaphshot = await db.collection('items').where('category', '==', category).get();
  const itemCount = querySnaphshot.size;
  console.log(`updating ${category} to ${itemCount}`);
  return await db.doc(`categories/${category}`).update('itemCount', itemCount);
});