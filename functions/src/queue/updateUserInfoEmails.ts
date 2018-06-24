import * as admin from 'firebase-admin';

// This function was just a helper to migrate over the email addresses from the
// authentication service to the firestore database, so that we can run a report
// on the website that contains email addresses.
// Going forward this shouldn't be necessary since the system now copies over these
// addresses whenever a user logs in.
export async function updateUserInfoEmails(db: FirebaseFirestore.Firestore, auth: admin.auth.Auth) {
  const userList = await auth.listUsers();
  await Promise.all(userList.users.map(async user => {
    const userInfo = await db.collection('users').doc(user.uid).get();
    if (userInfo) {
      if (userInfo.get('email')) {
        console.log('processing', user.uid, 'already has an email address stored', userInfo.get('email'), user.email);
      } else {
        await userInfo.ref.update({ email: user.email });
        console.log('processing', user.uid, 'updated email address to', user.email);
      }
    } else {
      console.error('missing userInfo for', user.uid, user.email);
    }
  }));
}