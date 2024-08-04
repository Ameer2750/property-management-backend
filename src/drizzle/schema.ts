import { pgTable, serial, varchar, timestamp, boolean, integer, numeric } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  phone: varchar('phone', { length: 20 }).unique(), // Ensure this line is correct
  role: varchar('role', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const propertyOwner = pgTable('property_owner', {
  id: serial('id').primaryKey(),
  propertyId: integer('property_id').references(() => property.id),
  userId: integer('user_id').references(() => user.id),
});

export const property = pgTable('property', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  contact: varchar('contact', { length: 255 }).notNull(),
  description: varchar('description', { length: 1000 }),
});

export const floor = pgTable('floor', {
  id: serial('id').primaryKey(),
  propertyId: integer('property_id').references(() => property.id),
  floorNumber: integer('floor_number').notNull(),
  name: varchar('name', { length: 255 }),
});

export const room = pgTable('room', {
  id: serial('id').primaryKey(),
  floorId: integer('floor_id').references(() => floor.id),
  name: varchar('name', { length: 255 }).notNull(),
  roomType: varchar('room_type', { length: 50 }).notNull(),
  rent: numeric('rent').notNull(),
  squareFootage: integer('square_footage').notNull(),
  occupancyLimit: integer('occupancy_limit').notNull(),
  availableBeds: integer('available_beds').notNull(),
  occupiedBeds: integer('occupied_beds').notNull(),
  bedRate: numeric('bed_rate').notNull(),
  availabilityStatus: varchar('availability_status', { length: 50 }).notNull(),
});

export const bedAllocation = pgTable('bed_allocation', {
  id: serial('id').primaryKey(),
  roomId: integer('room_id').references(() => room.id),
  tenantId: integer('tenant_id').references(() => tenant.id),
  bedNumber: integer('bed_number'),
  occupiedSince: timestamp('occupied_since').defaultNow(),
  status: varchar('status', { length: 50 }).notNull(),
});

export const roomFeature = pgTable('room_feature', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
});

export const roomRoomFeature = pgTable('room_room_feature', {
  id: serial('id').primaryKey(),
  roomId: integer('room_id').references(() => room.id),
  featureId: integer('feature_id').references(() => roomFeature.id),
});

export const rentAgreement = pgTable('rent_agreement', {
  id: serial('id').primaryKey(),
  propertyId: integer('property_id').references(() => property.id),
  roomId: integer('room_id').references(() => room.id),
  userId: integer('user_id').references(() => user.id),
  rentCycle: varchar('rent_cycle', { length: 50 }).notNull(),
  gracePeriod: integer('grace_period').notNull(),
  fineForLatePayment: numeric('fine_for_late_payment'),
  extraCharges: boolean('extra_charges').default(false),
  advancePayment: numeric('advance_payment'),
  pendingAmount: numeric('pending_amount'),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
});

export const payment = pgTable('payment', {
  id: serial('id').primaryKey(),
  rentAgreementId: integer('rent_agreement_id').references(() => rentAgreement.id),
  amount: numeric('amount').notNull(),
  paymentDate: timestamp('payment_date').notNull(),
  paymentMethod: varchar('payment_method', { length: 50 }).notNull(),
  transactionId: varchar('transaction_id', { length: 255 }).notNull(),
  isAdvance: boolean('is_advance').default(false),
  paymentForPeriod: varchar('payment_for_period', { length: 50 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(),
});

export const maintenanceRequest = pgTable('maintenance_request', {
  id: serial('id').primaryKey(),
  propertyId: integer('property_id').references(() => property.id),
  roomId: integer('room_id').references(() => room.id),
  userId: integer('user_id').references(() => user.id),
  description: varchar('description', { length: 1000 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  assignedTo: varchar('assigned_to', { length: 255 }),
  cost: numeric('cost'),
  completionDate: timestamp('completion_date'),
});

export const tenant = pgTable('tenant', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => user.id),
  propertyId: integer('property_id').references(() => property.id),
  roomId: integer('room_id').references(() => room.id),
  moveInDate: timestamp('move_in_date').notNull(),
  moveOutDate: timestamp('move_out_date'),
});

export const invoice = pgTable('invoice', {
  id: serial('id').primaryKey(),
  rentAgreementId: integer('rent_agreement_id').references(() => rentAgreement.id),
  amount: numeric('amount').notNull(),
  dueDate: timestamp('due_date').notNull(),
  status: varchar('status', { length: 50 }).notNull(),
});

export const document = pgTable('document', {
  id: serial('id').primaryKey(),
  rentAgreementId: integer('rent_agreement_id').references(() => rentAgreement.id),
  filePath: varchar('file_path', { length: 255 }).notNull(),
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
});

export const inspection = pgTable('inspection', {
  id: serial('id').primaryKey(),
  propertyId: integer('property_id').references(() => property.id),
  roomId: integer('room_id').references(() => room.id),
  inspectionDate: timestamp('inspection_date').notNull(),
  inspectorName: varchar('inspector_name', { length: 255 }).notNull(),
  comments: varchar('comments', { length: 1000 }),
});
