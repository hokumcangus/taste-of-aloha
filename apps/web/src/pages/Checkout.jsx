import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	clearCart,
	removeFromCart,
	setItemQuantity,
	syncCartToBackend,
} from "../store/slices/cartSlice";
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

	const isSyncing = syncStatus === "loading";
	const isPlacingOrder = placeOrderStatus === "loading";

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

			const paymentIntent = await paymentService.createIntent({
				amount: total,
				method: paymentMethod,
			});

			const order = await orderService.placeOrder({
				cartId: syncResult?.cartId,
				paymentMethod,
				paymentReference: paymentIntent.clientSecret,
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
				Review your cart, update quantities, then sync to backend.
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
							<div style={{ color: "#4b5563", fontSize: "0.9rem" }}>
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
								style={{ width: "80px", padding: "0.4rem" }}
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
					<div>Items: {itemCount}</div>
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
						<div style={{ color: "#b45309", fontSize: "0.85rem", marginTop: "0.5rem" }}>
							Login is required to place your order.
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
						{isSyncing ? "Syncing..." : "Sync Cart"}
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
