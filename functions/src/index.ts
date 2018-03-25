import { auth, Event, firestore, config} from 'firebase-functions';
import * as admin from 'firebase-admin';
import { setApiKey } from '@sendgrid/mail';

setApiKey(config().sendgrid.api_key);
admin.initializeApp(config().firebase);

export { sendWelcomeEmail } from './auth';
export { auctionItemAdded } from './auction';
