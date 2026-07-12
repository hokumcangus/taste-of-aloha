const ORDER_STATUS = Object.freeze({
  CART_SUBMITTED: "CART_SUBMITTED",
  CONFIRMED: "CONFIRMED",
  PREPARING: "PREPARING",
  READY_FOR_PICKUP: "READY_FOR_PICKUP",
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
});

const ROLE = Object.freeze({
  CUSTOMER: "CUSTOMER",
  ADMIN: "ADMIN",
  KITCHEN: "KITCHEN",
  DRIVER: "DRIVER",
  SYSTEM: "SYSTEM",
});

const TRANSITIONS = Object.freeze({
  [ORDER_STATUS.CART_SUBMITTED]: [
    { to: ORDER_STATUS.CONFIRMED, roles: [ROLE.ADMIN, ROLE.SYSTEM] },
    { to: ORDER_STATUS.CANCELLED, roles: [ROLE.CUSTOMER, ROLE.ADMIN] },
  ],
  [ORDER_STATUS.CONFIRMED]: [
    { to: ORDER_STATUS.PREPARING, roles: [ROLE.KITCHEN, ROLE.ADMIN] },
    { to: ORDER_STATUS.CANCELLED, roles: [ROLE.ADMIN] },
  ],
  [ORDER_STATUS.PREPARING]: [
    { to: ORDER_STATUS.READY_FOR_PICKUP, roles: [ROLE.KITCHEN, ROLE.ADMIN] },
    { to: ORDER_STATUS.CANCELLED, roles: [ROLE.ADMIN] },
  ],
  [ORDER_STATUS.READY_FOR_PICKUP]: [
    { to: ORDER_STATUS.OUT_FOR_DELIVERY, roles: [ROLE.DRIVER, ROLE.ADMIN] },
    { to: ORDER_STATUS.CANCELLED, roles: [ROLE.ADMIN] },
  ],
  [ORDER_STATUS.OUT_FOR_DELIVERY]: [
    { to: ORDER_STATUS.DELIVERED, roles: [ROLE.DRIVER, ROLE.ADMIN] },
    { to: ORDER_STATUS.CANCELLED, roles: [ROLE.ADMIN] },
  ],
  [ORDER_STATUS.DELIVERED]: [],
  [ORDER_STATUS.CANCELLED]: [],
});

function getAllowedTransitions(fromStatus) {
  return TRANSITIONS[fromStatus] || [];
}

function canTransition(fromStatus, toStatus, actorRole) {
  const allowed = getAllowedTransitions(fromStatus);
  return allowed.some(
    (transition) =>
      transition.to === toStatus &&
      (transition.roles.includes(actorRole) || transition.roles.includes(ROLE.SYSTEM)),
  );
}

module.exports = {
  ORDER_STATUS,
  ROLE,
  TRANSITIONS,
  getAllowedTransitions,
  canTransition,
};
