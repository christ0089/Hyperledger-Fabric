/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';
import { Refugee, ShelterParticipant } from '../../Models/Participants/user';
import { sHistory } from '../../Models/States/historyStates';

@Object()
export class ShelterSpace {

    @Property()
    public value: string;
    
    public shelterId: string;

    public capacity: number;

    public currentState: sHistory;

    public shelterHist: sHistory[];

    public currentRefugees: Refugee[];

    public currentStaff: ShelterParticipant[];

    public currentRefugeeCount: number;
}
