import { ShelterParticipantRole } from "../States/states";

export interface User {
    email: string;
    name: string;
    phone?: string;
}

export interface Donor extends User { }

export interface Refugee extends User { }

export interface ShelterParticipant extends User {
    participantRole: ShelterParticipantRole;
    shelterId: string;
}