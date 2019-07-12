interface cHistory {
    giver: ShelterParticipant; // Shelter participant that gave away the commodity
    consumer: Refugee; // All the Refugees that consumed the object 
    updateTime?: Date;
}

interface rHistory {
    shelterId: string;
    state: RefugeeState;
    updateTime?: Date;
}

interface sHistory {
    state: ShelterState;
    updateTime: Date;
}

interface cStateHistory {
    state: CommodityState;
    updateTime?: Date;
}