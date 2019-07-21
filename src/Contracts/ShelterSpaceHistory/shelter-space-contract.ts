/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { ShelterSpace } from './shelterSpace';

@Info({ title: 'ShelterSpaceContract', description: 'Shelter Space Contract Definition' })
export class ShelterSpaceContract extends Contract {


    @Transaction(false)
    @Returns('boolean')
    public async shelterSpaceExists(ctx: Context, shelterSpaceId: string): Promise<boolean> {
        const buffer = await ctx.stub.getState(shelterSpaceId);
        return (!!buffer && buffer.length > 0);
    }

    @Transaction()
    public async createShelterSpace(ctx: Context, shelterSpaceId: string, capacity: number): Promise<void> {
        const exists = await this.shelterSpaceExists(ctx, shelterSpaceId);
        if (exists) {
            throw new Error(`The ShelterSpace ${shelterSpaceId} already exists`);
        }
        const newShelter = new ShelterSpace();
        newShelter.shelterId = shelterSpaceId;
        newShelter.capacity = capacity;
        const buffer = Buffer.from(JSON.stringify(newShelter));
        await ctx.stub.putState(shelterSpaceId, buffer);
    }

    @Transaction(false)
    @Returns('ShelterSpace')
    public async readShelterSpace(ctx: Context, ShelterSpaceId: string): Promise<ShelterSpace> {
        const exists = await this.shelterSpaceExists(ctx, ShelterSpaceId);
        if (!exists) {
            throw new Error(`The ShelterSpace ${ShelterSpaceId} does not exist`);
        }
        const buffer = await ctx.stub.getState(ShelterSpaceId);
        const shelterSpace = JSON.parse(buffer.toString()) as ShelterSpace;
        return shelterSpace;
    }

    @Transaction()
    public async updateShelterSpace(ctx: Context, shelterSpaceId: string, shelterSpace: number): Promise<void> {
        const exists = await this.shelterSpaceExists(ctx, shelterSpaceId);
        if (!exists) {
            throw new Error(`The ShelterSpace ${shelterSpaceId} does not exist`);
        }
        const shelter = await this.readShelterSpace(ctx, shelterSpaceId);
        shelter.capacity--;
        const buffer = Buffer.from(JSON.stringify(shelter));
        await ctx.stub.putState(shelterSpaceId, buffer);
    }

    @Transaction()
    public async deleteShelterSpace(ctx: Context, shelterSpaceId: string): Promise<void> {
        const exists = await this.shelterSpaceExists(ctx, shelterSpaceId);
        if (!exists) {
            throw new Error(`The ShelterSpace ${shelterSpaceId} does not exist`);
        }
        await ctx.stub.deleteState(shelterSpaceId);
    }

}
