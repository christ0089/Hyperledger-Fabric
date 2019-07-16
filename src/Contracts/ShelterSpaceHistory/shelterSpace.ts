/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';
import { sHistory } from '../../Models/States/historyStates';
import { ShelterParticipant, Refugee } from '../../Models/Participants/user';

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

    constructor(shelterId, capacity){
        this.shelterId =shelterId;
        this.capacity = this.capacity;
        this.shelterHist = [];
        this.currentRefugees = [];
        this.currentStaff = [];
        this.currentRefugeeCount = 0;
    }
}
