/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';

@Object()
export class ShelterSpace {

    @Property()
    public shelterId: string;

    @Property()
    public capacity: number;

    @Property()
    public currentState: sHistory;

    @Property()
    public shelterHist: sHistory[];

    @Property()
    public currentRefugees: Refugee[];

    @Property()
    public currentStaff: ShelterParticipant[];

    @Property()
    private currentRefugeeCount: number;
}
