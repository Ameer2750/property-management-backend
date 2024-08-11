import { Inject, Injectable } from "@nestjs/common";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from '../drizzle/schema';
import { CreatePropertyType } from "./types";
import { DRIZZLE_ORM } from "src/common/utilities/constants/db.constant";

@Injectable()
export class PropertiesService {
    constructor(
        @Inject(DRIZZLE_ORM) private readonly drizzle: PostgresJsDatabase<typeof schema>,
    ) { }

    public async createPropertyBasicDetail(createPropertyType: CreatePropertyType) {
        try {

            const { address, property, userId } = createPropertyType;

            const [createProperty] = await this.drizzle
                .insert(schema.property)
                .values(property)
                .returning()

            const [createAddress] = await this.drizzle
                .insert(schema.address)
                .values(address)
                .returning()

            const propertyOwnerPayload = {
                userId,
                propertyId: createProperty.id
            }

            const createPropertyAddressPayload = {
                propertyId: createProperty.id,
                addressId: createAddress.id
            }

            await Promise.all([
                await this.drizzle
                    .insert(schema.propertyOwner)
                    .values(propertyOwnerPayload)
                    .returning(),
                await this.drizzle
                    .insert(schema.propertyAddress)
                    .values(createPropertyAddressPayload)
                    .returning()
            ]);


            return {
                status: 'success',
                message: 'Property Basic Details Added SuccessFully'
            }

        } catch (error) {
            console.log('error: ', error);

        }
    }

    public async getRoomType() {
        return this.drizzle.query.roomType.findMany();
    }

    public async createPropertyRoomOption() {}




}