Admin seeding
===============

To create a demo admin (email: `admin123@gmail.com`, password: `admin123`) run:

```bash
npm run seed-admin
```

This script uses Firebase client SDK to create the auth user if it does not exist and sets the `role: 'admin'` field on the user document in Firestore (`users` collection).

Before running:
- Ensure Email/Password sign-in is enabled in your Firebase project.
- Ensure your local environment has access to the Firebase project credentials set in `Config/firebase.config.js` (this repo already includes the config for development, but review your security settings before using in production).

Note: Deleting an auth account requires Firebase Admin SDK or the Firebase console; this script updates the Firestore document only if the user was created or signed in successfully.

Firestore rules and deployment

A recommended `firestore.rules` file is included at the project root. It enforces:
- public reads for rooms
- admin-only create/update/delete for rooms
- authenticated users can create reservations for themselves
- owners can cancel their reservations
- admins can manage reservations and users

To deploy rules using Firebase CLI:

```bash
firebase login
firebase init firestore    # if not already initialized
firebase deploy --only firestore:rules
```

Notes & next steps

- Deploying the `firestore.rules` file is required to enforce admin privileges server-side; client-side checks are not sufficient.
- For production, consider adding more granular rules (field validation, rate limits) and monitoring audit logs.
