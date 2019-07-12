interface User {
    email: string;
    name: string;
    phone?: string;
}

interface Donor extends User { }

interface Refugee extends User { }

interface ShelterParticipant extends User {
    participantRole: ShelterParticipantRole;
    shelterId: string;
}