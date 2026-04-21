import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	clearCart,
	removeFromCart,
	setItemQuantity,
	syncCartToBackend,
} from "../store/slices/cartSlice";

const Checkout = () => {
	const dispatch = useDispatch();
	const { items, itemCount, total, syncStatus, error, syncedAt } = useSelector(
		(state) => state.cart,
	);

	const isSyncing = syncStatus === "loading";

	if (items.length === 0) {
		return (
			<div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>
				<h1>Checkout</h1>
				<p>Your cart is empty. Add something delicious first.</p>
				<Link to="/menu">Go to menu</Link>
			</div>
		);
	}

	return (
		<div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>
			<h1 style={{ marginBottom: "0.5rem" }}>Checkout</h1>
			<p style={{ marginTop: 0, color: "#4b5563" }}>
				Review your cart, update quantities, then sync to backend.
			</p>

			<div style={{ display: "grid", gap: "0.75rem", marginTop: "1.5rem" }}>
				{items.map((item) => (
					<div
						key={item.menuId}
						style={{
							display: "grid",
							gridTemplateColumns: "1fr auto auto auto",
							alignItems: "center",
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

						<div style={{ minWidth: "100px", textAlign: "right", fontWeight: 600 }}>
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
						{isSyncing ? "Syncing..." : "Sync to backend"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default Checkout;
