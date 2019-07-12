/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { Commodity } from './commodity';

@Info({ title: 'CommodityContract', description: 'My Smart Contract' })
export class CommodityContract extends Contract {

    @Transaction(false)
    @Returns('boolean')
    public async commodityExists(ctx: Context, commodityId: string): Promise<boolean> {
        const buffer = await ctx.stub.getState(commodityId);
        return (!!buffer && buffer.length > 0);
    }

    @Transaction()
    public async createCommodity(ctx: Context, commodityId: string, value: Commodity): Promise<void> {
        const exists = await this.commodityExists(ctx, commodityId);
        if (exists) {
            throw new Error(`The commodity ${commodityId} already exists`);
        }
        let commodity = new Commodity();
        commodity = value;
        const buffer = Buffer.from(JSON.stringify(commodity));
        await ctx.stub.putState(commodityId, buffer);
    }

    @Transaction(false)
    @Returns('Commodity')
    public async readCommodity(ctx: Context, commodityId: string): Promise<Commodity> {
        const exists = await this.commodityExists(ctx, commodityId);
        if (!exists) {
            throw new Error(`The commodity ${commodityId} does not exist`);
        }
        const buffer = await ctx.stub.getState(commodityId);
        const commodity = JSON.parse(buffer.toString()) as Commodity;
        return commodity;
    }

    @Transaction()
    public async updateCommodity(ctx: Context, commodityId: string, cHistory: cHistory): Promise<void> {
        const exists = await this.commodityExists(ctx, commodityId);
        if (!exists) {
            throw new Error(`The commodity ${commodityId} does not exist`);
        }
        let commodity = await this.readCommodity(ctx, commodityId);

        // Asset is out of Stock
        if (commodity.availableQuantity === 0) {
            commodity.currentState.state = CommodityState.OUT_OF_STOCK;
            commodity.commodityStateHist.push(commodity.currentState);
        };
        if (commodity.originalQuantity > commodity.consumedQuantity && commodity.availableQuantity > 0) {
            commodity.consumedQuantity++;
            commodity.availableQuantity--;
            commodity.commodityHist.push(cHistory);
        }
        const buffer = Buffer.from(JSON.stringify(commodity));
        await ctx.stub.putState(commodityId, buffer);
    }

    @Transaction()
    public async deleteCommodity(ctx: Context, commodityId: string): Promise<void> {
        const exists = await this.commodityExists(ctx, commodityId);
        if (!exists) {
            throw new Error(`The commodity ${commodityId} does not exist`);
        }
        await ctx.stub.deleteState(commodityId);
    }
}
