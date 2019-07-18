import { ShelterParticipant, Refugee } from "../Participants/user";
import { ShelterState, CommodityState, RefugeeState } from "./states";

export interface iCHistory {
    giver: ShelterParticipant; // Shelter participant that gave away the commodity
    consumer: Refugee; // All the Refugees that consumed the object 
    updateTime?: Date;
}

export class cHistory implements iCHistory {
    giver: ShelterParticipant; // Shelter participant that gave away the commodity
    consumer: Refugee; // All the Refugees that consumed the object 
    updateTime?: Date;

}

export interface rHistory {
    shelterId: string;
    state: RefugeeState;
    updateTime?: number;
}

export interface sHistory {
    state: ShelterState;
    updateTime: number;
}

export interface cStateHistory {
    state: CommodityState;
    updateTime?: number;
}