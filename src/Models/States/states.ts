export enum CommodityState {
    CREATED,
    IN_TRANSIT,
    DELIVERED,
    OUT_OF_STOCK,
}

export enum RefugeeState {
    ARRIVED,
    DEPARTED,
    CRITICAL,
    RESCUED,
}

export enum ShelterState {
    AVAILABLE,
    AFFECTED,
    FULL_CAPACITY,
    OVER_CAPACITY,
}

export enum ShelterParticipantRole {
    ADMIN,
    RECEIVER,
    DELIVER,
    CARETAKER,
    COUNTER,
}