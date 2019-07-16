import { ShelterParticipant, Refugee } from "../Participants/user";
import { ShelterState, CommodityState, RefugeeState } from "./states";

export interface cHistory {
    giver: ShelterParticipant; // Shelter participant that gave away the commodity
    consumer: Refugee; // All the Refugees that consumed the object 
    updateTime?: Date;
}

export interface rHistory {
    shelterId: string;
    state: RefugeeState;
    updateTime?: Date;
}

export interface sHistory {
    state: ShelterState;
    updateTime: Date;
}

export interface cStateHistory {
    state: CommodityState;
    updateTime?: Date;
}