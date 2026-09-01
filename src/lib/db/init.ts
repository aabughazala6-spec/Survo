import db from '@/lib/db/schema';

export async function initializeDB() {
  await db.open();
  console.log('Database initialized');
}

export default initializeDB;
