export type CreatePropertyType = {
    userId: number;
    address: {
        blockNo: string;
        locality: string;
        city: string;
        state: string;
        pincode: string;
        country?: string;
    }
    property: {
        name: string;
        contact: string;
        description?: string;
        genderPreference: string;
        suitability: string;
    }
}