/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { cHistory } from '../../Models/States/historyStates';
import { CommodityState } from '../../Models/States/states';
import { Commodity } from './commodity';

'use strict';
@Info({ title: 'CommodityContract', description: 'Commodity Contract Definition' })
export class CommodityContract extends Contract {

    async init(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const commodity = [
            {
                "tradingSymbol": "7988",
                "description": "",
                "originalQuantity": 10,
                "consumedQuantity": 0,
                "availableQuantity": 10,
                "commodityStateHist": [],
                "commodityHist": [],
                "currentState": {
                    "state": 0
                }
            }, {
                "$class": "org.christianalva96.com.Commodity",
                "tradingSymbol": "8614",
                "description": "",
                "mainExchange": "",
                "name": "",
                "originalQuantity": 10,
                "consumedQuantity": 10,
                "availableQuantity": 10,
                "commodityStateHist": [
                    {
                        "state": 0,
                        "updateTime": "2019-07-10T22:18:12.129Z"
                    },
                    {
                        "state": 3,
                        "updateTime": "2019-07-10T22:18:12.129Z"
                    }
                ],
                "commodityHist": [],
                "currentState": {
                    "state": 2,
                    "updateTime": "2019-07-10T22:18:12.129Z"
                },
            }
        ]
        for (let i = 0; i < commodity.length; i++) {
            await ctx.stub.putState('Commodity' + i, Buffer.from(JSON.stringify(commodity[i])));
            console.info('Added <--> ', commodity[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    @Transaction(false)
    @Returns('boolean')
    public async commodityExists(ctx: Context, commodityId: string): Promise<boolean> {
        const buffer = await ctx.stub.getState(commodityId);
        return (!!buffer && buffer.length > 0);
    }

    /**
     *
     * createCommodity
     *
     * Creates a voter in the world state, based on the args given.
     *  
     * @param args.commodityId - the Id the voter, used as the key to store the voter object
     * @param args.value - the registrar the voter is registered for
     * @returns - nothing - but updates the world state with a voter
     */
    public async createCommodity(ctx: Context, commodityId: string, value: Commodity): Promise<void> {
        const exists = await this.commodityExists(ctx, commodityId);
        if (exists) {
            throw new Error(`The commodity ${commodityId} already exists`);
        }
        const buffer = Buffer.from(JSON.stringify(value));
        await ctx.stub.putState(commodityId, buffer);
    }

    /**
     *
     * readCommodity
     *
     * Creates a voter in the world state, based on the args given.
     * @param args.commodityId - the Id the voter, used as the key to store the voter object
     * @returns - Bool - but updates the world state with a voter
     */
    public async readCommodity(ctx: Context, commodityId: string): Promise<Commodity> {
        const exists = await this.commodityExists(ctx, commodityId);
        if (!exists) {
            throw new Error(`The commodity ${commodityId} does not exist`);
        }
        const buffer = await ctx.stub.getState(commodityId);
        const commodity = JSON.parse(buffer.toString()) as Commodity;
        return commodity;
    }


    /**
     *
     * updateComidity
     *
     * Creates a voter in the world state, based on the args given.
     * @param args.commodityId - the Id the voter, used as the key to store the voter object
     * @returns - Bool - but updates the world state with a voter
     */
    public async updateCommodity(ctx: Context, commodityId: string, chistory: cHistory): Promise<void> {
        const exists = await this.commodityExists(ctx, commodityId);
        if (!exists) {
            throw new Error(`The commodity ${commodityId} does not exist`);
        }
        const commodity = await this.readCommodity(ctx, commodityId);

        // Asset is out of Stock
        if (commodity.availableQuantity === 0) {
           commodity.currentState.state = CommodityState.OUT_OF_STOCK;
           commodity.commodityStateHist.push(commodity.currentState);
        };
        if (commodity.originalQuantity > commodity.consumedQuantity && commodity.availableQuantity > 0) {
            commodity.consumedQuantity++;
            commodity.availableQuantity--;
            commodity.commodityHist.push(chistory);
        }
        const buffer = Buffer.from(JSON.stringify(commodity));
        await ctx.stub.putState(commodityId, buffer);
    }

    /**
     *
     * deleteCommodity
     *
     * Creates a voter in the world state, based on the args given.
     * @param args.commodityId - the Id the voter, used as the key to store the voter object
     * @returns - Bool - but updates the world state with a voter
     */
    public async deleteCommodity(ctx: Context, commodityId: string): Promise<void> {
        const exists = await this.commodityExists(ctx, commodityId);
        if (!exists) {
            throw new Error(`The commodity ${commodityId} does not exist`);
        }
        await ctx.stub.deleteState(commodityId);
    }
}