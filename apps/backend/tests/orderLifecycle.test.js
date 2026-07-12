const {
  canTransition,
  ORDER_STATUS,
  ROLE,
} = require("../src/constants/orderLifecycle");

describe("order lifecycle permissions", () => {
  test("kitchen can move CONFIRMED to PREPARING", () => {
    expect(
      canTransition(ORDER_STATUS.CONFIRMED, ORDER_STATUS.PREPARING, ROLE.KITCHEN),
    ).toBe(true);
  });

  test("customer cannot move PREPARING to READY_FOR_PICKUP", () => {
    expect(
      canTransition(
        ORDER_STATUS.PREPARING,
        ORDER_STATUS.READY_FOR_PICKUP,
        ROLE.CUSTOMER,
      ),
    ).toBe(false);
  });

  test("driver can move OUT_FOR_DELIVERY to DELIVERED", () => {
    expect(
      canTransition(
        ORDER_STATUS.OUT_FOR_DELIVERY,
        ORDER_STATUS.DELIVERED,
        ROLE.DRIVER,
      ),
    ).toBe(true);
  });
});
