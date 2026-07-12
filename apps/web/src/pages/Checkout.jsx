import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	clearCart,
	removeFromCart,
	setItemQuantity,
	syncCartToBackend,
} from "../store/slices/cartSlice";
import { guestLogin } from "../store/slices/authSlice";
import { paymentService } from "../services/paymentService";
import { orderService } from "../services/orderService";

const Checkout = () => {
	const dispatch = useDispatch();
	const authUser = useSelector((state) => state.auth.user);
	const { items, itemCount, total, syncStatus, error, syncedAt } = useSelector(
		(state) => state.cart,
	);
	const [paymentMethod, setPaymentMethod] = React.useState("card");
	const [placeOrderStatus, setPlaceOrderStatus] = React.useState("idle");
	const [checkoutError, setCheckoutError] = React.useState(null);
	const [placedOrder, setPlacedOrder] = React.useState(null);
	const [guestPhone, setGuestPhone] = React.useState("");
	const [guestStatus, setGuestStatus] = React.useState("idle");
	const [guestError, setGuestError] = React.useState(null);

	const isSyncing = syncStatus === "loading";
	const isPlacingOrder = placeOrderStatus === "loading";
	const isGuestLoading = guestStatus === "loading";

	const handleGuestContinue = async () => {
		setGuestError(null);
		try {
			setGuestStatus("loading");
			await dispatch(guestLogin({ phone: guestPhone })).unwrap();
			setGuestStatus("succeeded");
		} catch (err) {
			setGuestError(err?.message || String(err) || "Failed to continue as guest");
			setGuestStatus("failed");
		}
	};

	const handlePlaceOrder = async () => {
		if (!authUser) {
			setCheckoutError("Please login before placing your order.");
			return;
		}

		if (items.length === 0) {
			setCheckoutError("Your cart is empty.");
			return;
		}

		setPlaceOrderStatus("loading");
		setCheckoutError(null);

		try {
			const syncResult = await dispatch(syncCartToBackend()).unwrap();

			let paymentReference = null;
			if (paymentMethod !== "cash") {
				const paymentIntent = await paymentService.createIntent({
					amount: total,
					method: paymentMethod,
				});
				paymentReference = paymentIntent.intentId;
			}

			const order = await orderService.placeOrder({
				cartId: syncResult?.cartId,
				paymentMethod,
				paymentReference,
			});

			dispatch(clearCart());
			setPlacedOrder(order);
			setPlaceOrderStatus("succeeded");
		} catch (err) {
			setCheckoutError(err.message || "Failed to place order");
			setPlaceOrderStatus("failed");
		}
	};

	if (items.length === 0) {
		return (
			<div
				style={{
					maxWidth: "900px",
					width: "100%",
					margin: "0 auto",
					padding: "1rem",
				}}
			>
				<h1>Checkout</h1>
				<p>Your cart is empty. Add something delicious first.</p>
				<Link to="/menu">Go to menu</Link>
			</div>
		);
	}

	if (placedOrder) {
		return (
			<div
				style={{
					maxWidth: "900px",
					width: "100%",
					margin: "0 auto",
					padding: "1rem",
				}}
			>
				<h1>Order placed</h1>
				<p>
					Mahalo. Your order #{placedOrder.id} was placed successfully.
				</p>
				<p>Total paid: ${Number(placedOrder.total).toFixed(2)}</p>
				<div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
					<Link to="/menu">Continue shopping</Link>
					<Link to="/dashboard">View dashboard</Link>
				</div>
			</div>
		);
	}

	return (
		<div
			style={{
				maxWidth: "900px",
				width: "100%",
				margin: "0 auto",
				padding: "1rem",
			}}
		>
			<h1 style={{ marginBottom: "0.5rem" }}>Checkout</h1>
			<p style={{ marginTop: 0, color: "#4b5563" }}>
				Review your cart, update quantities, then calculate your total.
			</p>

			<div style={{ display: "grid", gap: "0.75rem", marginTop: "1.5rem" }}>
				{items.map((item) => (
					<div
						key={item.menuId}
						style={{
							display: "flex",
							flexDirection: "column",
							gap: "0.75rem",
							border: "1px solid #d1d5db",
							borderRadius: "8px",
							padding: "0.8rem",
							backgroundColor: "#fff",
						}}
					>
						<div>
							<div style={{ fontWeight: 600 }}>{item.name}</div>
							<div style={{ color: "#1c2025", fontSize: "0.9rem", border: "1px solid #8d8d8e", display: "inline-block", padding: "0.25rem 0.5rem", borderRadius: "4px" }}>
								${Number(item.price).toFixed(2)} each
							</div>
						</div>

						<div
							style={{
								display: "flex",
								flexWrap: "wrap",
								alignItems: "center",
								justifyContent: "space-between",
								gap: "0.75rem",
							}}
						>
							<input
								type="number"
								min="1"
								value={item.quantity}
								onChange={(event) =>
									dispatch(
										setItemQuantity({
											menuId: item.menuId,
											quantity: Number(event.target.value),
										}),
									)
								}
								style={{ width: "80px", padding: "0.4rem", borderRadius: "6px", border: "1px solid #a6a9ae" }}
							/>

							<div style={{ fontWeight: 600 }}>
								${(Number(item.price) * item.quantity).toFixed(2)}
							</div>

							<button
								onClick={() => dispatch(removeFromCart(item.menuId))}
								style={{
									border: "none",
									borderRadius: "6px",
									backgroundColor: "#ef4444",
									color: "#fff",
									padding: "0.5rem 0.75rem",
									cursor: "pointer",
								}}
							>
								Remove
							</button>
						</div>
					</div>
				))}
			</div>

			<div
				style={{
					marginTop: "1.5rem",
					paddingTop: "1rem",
					borderTop: "1px solid #d1d5db",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					flexWrap: "wrap",
					gap: "0.75rem",
				}}
			>
				<div>
					<div id="item-count">Items: {itemCount}</div>
					<div style={{ fontSize: "1.25rem", fontWeight: 700 }}>
						Total: ${Number(total).toFixed(2)}
					</div>
					<div style={{ marginTop: "0.5rem" }}>
						<label htmlFor="payment-method" style={{ marginRight: "0.5rem" }}>
							Payment:
						</label>
						<select
							id="payment-method"
							value={paymentMethod}
							onChange={(event) => setPaymentMethod(event.target.value)}
						>
							<option value="card">Card</option>
							<option value="apple_pay">Apple Pay</option>
							<option value="cash">Cash Pickup</option>
						</select>
					</div>
					{!authUser && (
						<div
							id="guest-checkout"
							style={{
								marginTop: "1rem",
								border: "1px solid #d97706",
								borderRadius: "8px",
								padding: "1rem",
								backgroundColor: "#fffbeb",
							}}
						>
							<p style={{ margin: "0 0 0.75rem", fontWeight: 600, color: "#92400e" }}>
								Enter your phone number to continue as a guest
							</p>
							<div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
								<input
									type="tel"
									id="guest-phone"
									placeholder="e.g. 8085551234"
									value={guestPhone}
									onChange={(e) => setGuestPhone(e.target.value)}
									style={{
										flex: 1,
										minWidth: "160px",
										padding: "0.5rem",
										borderRadius: "6px",
										border: "1px solid #d97706",
									}}
								/>
								<button
									id="guest-continue"
									onClick={handleGuestContinue}
									disabled={isGuestLoading || !guestPhone.trim()}
									style={{
										border: "none",
										borderRadius: "6px",
										backgroundColor: "#d97706",
										color: "#fff",
										padding: "0.5rem 1rem",
										cursor: isGuestLoading || !guestPhone.trim() ? "not-allowed" : "pointer",
										opacity: isGuestLoading || !guestPhone.trim() ? 0.6 : 1,
									}}
								>
									{isGuestLoading ? "Verifying..." : "Continue as Guest"}
								</button>
							</div>
							{guestError && (
								<p style={{ color: "#dc2626", fontSize: "0.85rem", marginTop: "0.5rem" }}>
									{guestError}
								</p>
							)}
							<p style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "#78716c" }}>
								Already have an account?{" "}
								<Link to="/login" style={{ color: "#1d4ed8" }}>Sign in</Link>
							</p>
						</div>
					)}
					{syncedAt && (
						<div style={{ color: "#059669", fontSize: "0.85rem" }}>
							Last synced: {new Date(syncedAt).toLocaleString()}
						</div>
					)}
					{error && (
						<div style={{ color: "#dc2626", fontSize: "0.85rem" }}>
							Sync error: {error}
						</div>
					)}
					{checkoutError && (
						<div style={{ color: "#dc2626", fontSize: "0.85rem" }}>
							Checkout error: {checkoutError}
						</div>
					)}
				</div>

				<div style={{ display: "flex", gap: "0.5rem" }}>
					<button
						onClick={() => dispatch(clearCart())}
						style={{
							border: "1px solid #9ca3af",
							borderRadius: "6px",
							backgroundColor: "#fff",
							color: "#111827",
							padding: "0.6rem 0.9rem",
							cursor: "pointer",
						}}
					>
						Clear cart
					</button>
					<button
						onClick={() => dispatch(syncCartToBackend())}
						disabled={isSyncing}
						style={{
							border: "none",
							borderRadius: "6px",
							backgroundColor: "#1d4ed8",
							color: "#fff",
							padding: "0.6rem 0.9rem",
							cursor: isSyncing ? "not-allowed" : "pointer",
							opacity: isSyncing ? 0.7 : 1,
						}}
					>
						{isSyncing ? "Syncing..." : "Total"}
					</button>
					<button
						onClick={handlePlaceOrder}
						disabled={isPlacingOrder || isSyncing || !authUser}
						style={{
							border: "none",
							borderRadius: "6px",
							backgroundColor: "#059669",
							color: "#fff",
							padding: "0.6rem 0.9rem",
							cursor:
								isPlacingOrder || isSyncing || !authUser ? "not-allowed" : "pointer",
							opacity: isPlacingOrder || isSyncing || !authUser ? 0.7 : 1,
						}}
					>
						{isPlacingOrder ? "Placing..." : "Pay & Place Order"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default Checkout;
