import { bigint, bigserial, boolean, integer, numeric, pgTable, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core';

const primaryKeyColumn = () => bigserial('id', { mode: 'bigint' }).primaryKey();

export const userTable = pgTable('user', {
  id: primaryKeyColumn(),
  firstName: varchar('firstName', { length: 255 }).notNull(),
  lastName: varchar('lastName', { length: 255 }),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  awsId: varchar('awsId', { length: 255 }).notNull(),
  arn: varchar('arn', { length: 255 }).notNull(),
  accountStatus: boolean('accountStatus').default(false).notNull(),
  refreshToken: varchar('refreshToken', { length: 255 }),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
}, table => {
  return {
    emailIndex: uniqueIndex('emailIndex').on(table.email),
    awsIdIndex: uniqueIndex('awsIdIndex').on(table.awsId)
  }
});