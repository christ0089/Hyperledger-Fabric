/*
 * SPDX-License-Identifier: Apache-2.0
 */
import { cStateHistory, cHistory } from '../../Models/States/historyStates';


'use strict';

export class Commodity {
    public tradingSymbol: string;
    public mainExchange: string;
    public name: string;
    public originalQuantity: number;
    public consumedQuantity: number;
    public availableQuantity: number;
    public currentState: cStateHistory;
    public commodityStateHist: cStateHistory[];
    public commodityHist: cHistory[];


    constructor(tradingSymbol, mainExchange, name, originalQuantity, consumedQuantity, currentState, commodityStateHist, commodityHist) {
        this.tradingSymbol = tradingSymbol;
        this.mainExchange = mainExchange;
        this.name = name;
        this.originalQuantity = originalQuantity;
        this.consumedQuantity = consumedQuantity;
        this.commodityHist = commodityHist;
        this.currentState = currentState;
        this.commodityStateHist = commodityStateHist;
        this.commodityHist = commodityHist;
    }
}
