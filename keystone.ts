// External dependencies
import { createAuth } from '@keystone-next/auth';
import { config, createSchema } from '@keystone-next/keystone/schema';
import {
  withItemData,
  statelessSessions,
} from '@keystone-next/keystone/session';
import 'dotenv/config';

// Local dependencies
import { User } from './schemas/User';
import { Product } from './schemas/Product';

const databaseUrl = process.env.DATABASE_URL || 'mongodb://localhost/sick-fits';

const sessionConfig = {
  maxAge: 365 * 24 * 60 * 60,
  secret: process.env.COOKIE_SECRET,
};

const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  initFirstItem: { fields: ['name', 'email', 'password'] },
});

export default withAuth(
  config({
    server: { cors: { origin: [process.env.FRONTEND_URL], credentials: true } },
    db: { adapter: 'mongoose', url: databaseUrl },
    lists: createSchema({ User, Product }),
    ui: { isAccessAllowed: ({ session }) => !!session?.data },
    session: withItemData(statelessSessions(sessionConfig), { User: 'id' }),
  })
);
