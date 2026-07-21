# Firestore Indexes

The app uses compound Firestore queries that may require indexes in production.

The current dashboard avoids compound indexes by sorting small result sets in app
code. If you move sorting/filtering back into Firestore for larger datasets,
create indexes for:

- `feedback`: `userId` ascending, `createdAt` descending
- `interviews`: `userId` ascending, `createdAt` descending
- `interviews`: `finalized` ascending, `createdAt` descending

Firestore usually provides a direct creation link in the runtime error when an
index is missing.
