import { config} from 'firebase-functions';
import * as admin from 'firebase-admin';
import { setApiKey } from '@sendgrid/mail';
import { sendWelcomeEmail } from './auth';
import { auctionItemAdded, bidEntered, bidInfoUpdated } from './auction';
import { processQueue } from './queue';

setApiKey(config().sendgrid.api_key);
admin.initializeApp(config().firebase);

exports.sendWelcomeEmail = sendWelcomeEmail;
exports.auctionItemAdded = auctionItemAdded;
exports.bidEntered = bidEntered;
exports.bidInfoUpdated = bidInfoUpdated;
exports.processQueue = processQueue;