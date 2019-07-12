enum CommodityState {
    CREATED,
    IN_TRANSIT,
    DELIVERED,
    OUT_OF_STOCK,
}

enum RefugeeState {
    ARRIVED,
    DEPARTED,
    CRITICAL,
    RESCUED,
}

enum ShelterState {
    AVAILABLE,
    AFFECTED,
    FULL_CAPACITY,
    OVER_CAPACITY,
}

enum ShelterParticipantRole {
    ADMIN,
    RECEIVER,
    DELIVER,
    CARETAKER,
    COUNTER,
}