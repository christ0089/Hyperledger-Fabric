/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';

@Object()
export class Commodity {

    @Property()
    public tradingSymbol: string;

    @Property()
    public mainExchange: string;

    @Property()
    public name: string;

    @Property()
    public originalQuantity: number;

    @Property()
    public consumedQuantity: number;

    @Property()
    public availableQuantity: number;

    @Property()
    public commodityStateHist: cStateHistory[];

    @Property()
    public commodityHist: cHistory[];

    @Property()
    public currentState: cStateHistory;

    @Property()
    private donor: Donor;

    @Property()
    private shelter: Shelter;
}
