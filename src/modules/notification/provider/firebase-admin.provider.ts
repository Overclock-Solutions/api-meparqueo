import { Provider } from '@nestjs/common';
import * as admin from 'firebase-admin';
import ConfigLoader from 'src/lib/ConfigLoader';

const config = ConfigLoader();

export const FirebaseAdminProvider: Provider = {
  provide: 'FIREBASE_ADMIN',
  useFactory: () => {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: config.firebase.admin.projectId,
          privateKey:
            config.firebase.admin.privateKey?.replace(/\\n/g, '\n') || '',
          clientEmail: config.firebase.admin.clientEmail,
        }),
      });
    }
    return admin;
  },
};
