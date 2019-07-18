/*
 * SPDX-License-Identifier: Apache-2.0
 */
import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { cHistory } from '../../Models/States/historyStates';
import { CommodityState } from '../../Models/States/states';
import { Commodity } from './commodity';

@Info({ title: 'CommodityContract', description: 'Commodity Contract Definition' })
export class CommodityContract extends Contract {

    @Transaction(false)
    @Returns('boolean')
    public async commodityExists(ctx: Context, myAssetId: string): Promise<boolean> {
        const buffer = await ctx.stub.getState(myAssetId);
        return (!!buffer && buffer.length > 0);
    }

    @Transaction()
    public async createCommodity(ctx: Context, commdityId: string, value: string, quantity: number): Promise<void> {
        const exists = await this.commodityExists(ctx, commdityId);
        if (exists) {
            throw new Error(`The my asset ${commdityId} already exists`);
        }
        const commodity = new Commodity();
        commodity.value = value;
        commodity.tradingSymbol = commdityId;
        commodity.originalQuantity = quantity;
        commodity.availableQuantity = quantity;
        commodity.consumedQuantity = 0;
        const buffer = Buffer.from(JSON.stringify(commodity));
        await ctx.stub.putState(commdityId, buffer);
    }

    @Transaction(false)
    @Returns('Commodity')
    public async readCommodity(ctx: Context, myAssetId: string): Promise<Commodity> {
        const exists = await this.commodityExists(ctx, myAssetId);
        if (!exists) {
            throw new Error(`The my asset ${myAssetId} does not exist`);
        }
        const buffer = await ctx.stub.getState(myAssetId);
        const myAsset = JSON.parse(buffer.toString()) as Commodity;
        return myAsset;
    }

    @Transaction()
    public async updateCommodity(ctx: Context, myAssetId: string): Promise<void> {
        const exists = await this.commodityExists(ctx, myAssetId);
        if (!exists) {
            throw new Error(`The my asset ${myAssetId} does not exist`);
        }
        const commodity = await this.readCommodity(ctx, myAssetId);
        console.log(commodity);
        if (commodity.availableQuantity === 0) {
            if (commodity.currentState === null) {
                commodity.currentState = {
                    state : CommodityState.OUT_OF_STOCK,
                    updateTime: Date.now()
                };
            }
            if (commodity.commodityStateHist === null) {
                commodity.commodityStateHist = [commodity.currentState];
            } else {
                commodity.commodityStateHist.push(commodity.currentState);
            }
        };
        if (commodity.originalQuantity > commodity.consumedQuantity && commodity.availableQuantity > 0) {
            commodity.consumedQuantity++;
            commodity.availableQuantity--;
        }
        const buffer = Buffer.from(JSON.stringify(commodity));
        await ctx.stub.putState(myAssetId, buffer);
    }

    @Transaction()
    public async deleteCommodity(ctx: Context, myAssetId: string): Promise<void> {
        const exists = await this.commodityExists(ctx, myAssetId);
        if (!exists) {
            throw new Error(`The my asset ${myAssetId} does not exist`);
        }
        await ctx.stub.deleteState(myAssetId);
    }
}