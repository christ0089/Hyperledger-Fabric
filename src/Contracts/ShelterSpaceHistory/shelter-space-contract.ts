/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { ShelterSpace } from './shelterSpace';

@Info({ title: 'ShelterSpaceContract', description: 'Shelter Space Contract Definition' })
export class ShelterSpaceContract extends Contract {

    public async init(ctx) {
        const shelterSpace1 = new ShelterSpace('001', 1);
        await ctx.stub.putState('ShelterSpace' + 1, Buffer.from(JSON.stringify(shelterSpace1)));
        console.info('Added <--> ', shelterSpace1);
    }

    @Transaction(false)
    @Returns('boolean')
    public async ShelterSpaceExists(ctx: Context, shelterSpaceId: string): Promise<boolean> {
        const buffer = await ctx.stub.getState(shelterSpaceId);
        return (!!buffer && buffer.length > 0);
    }

    @Transaction()
    public async createShelterSpace(ctx: Context, shelterSpaceId: string, value: ShelterSpace): Promise<void> {
        const exists = await this.ShelterSpaceExists(ctx, shelterSpaceId);
        if (exists) {
            throw new Error(`The ShelterSpace ${shelterSpaceId} already exists`);
        }

        const buffer = Buffer.from(JSON.stringify(value));
        await ctx.stub.putState(shelterSpaceId, buffer);
    }

    @Transaction(false)
    @Returns('ShelterSpace')
    public async readShelterSpace(ctx: Context, ShelterSpaceId: string): Promise<ShelterSpace> {
        const exists = await this.ShelterSpaceExists(ctx, ShelterSpaceId);
        if (!exists) {
            throw new Error(`The ShelterSpace ${ShelterSpaceId} does not exist`);
        }
        const buffer = await ctx.stub.getState(ShelterSpaceId);
        const shelterSpace = JSON.parse(buffer.toString()) as ShelterSpace;
        return shelterSpace;
    }

    @Transaction()
    public async updateShelterSpace(ctx: Context, shelterSpaceId: string, newValue: ShelterSpace): Promise<void> {
        const exists = await this.ShelterSpaceExists(ctx, shelterSpaceId);
        if (!exists) {
            throw new Error(`The ShelterSpace ${shelterSpaceId} does not exist`);
        }

        const buffer = Buffer.from(JSON.stringify(newValue));
        await ctx.stub.putState(shelterSpaceId, buffer);
    }

    @Transaction()
    public async deleteShelterSpace(ctx: Context, shelterSpaceId: string): Promise<void> {
        const exists = await this.ShelterSpaceExists(ctx, shelterSpaceId);
        if (!exists) {
            throw new Error(`The ShelterSpace ${shelterSpaceId} does not exist`);
        }
        await ctx.stub.deleteState(shelterSpaceId);
    }

}
