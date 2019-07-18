/*
 * SPDX-License-Identifier: Apache-2.0
 */
import { Object, Property } from 'fabric-contract-api';
import { cHistory, cStateHistory  } from '../../Models/States/historyStates';

@Object()
export class Commodity {

    @Property()
    public value: string;

    public tradingSymbol: string;

    public mainExchange: string;

    public name: string;

    public originalQuantity: number;

    public consumedQuantity: number;

    public currentState: cStateHistory;

    public commodityStateHist: cStateHistory[];

    public commodityHist: cHistory[];

    public availableQuantity: number;
}
