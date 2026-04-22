import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchMenuItems } from "../store/slices/menuSlice";
import { addToCart } from "../store/slices/cartSlice";
import { useSelector, useDispatch } from "react-redux";
import { fetchMenuItems } from "../store/slices/menuSlice";

const Menu = () => {
  const dispatch = useDispatch();
  const { menuItems, loading, error } = useSelector((state) => state.menu);
  useEffect(() => {
    dispatch(fetchMenuItems());
  }, [dispatch]);

  if (loading) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <h1>Menu</h1>
        <p>Loading menu items...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <h1>Menu</h1>
        <p style={{ color: "red" }}>Error: {error}</p>
        <button onClick={() => dispatch(fetchMenuItems())}>Retry</button>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "2rem",
        textAlign: "center",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          marginBottom: "2rem",
          color: "#333",
        }}
      >
        Menu
      </h1>
      <div style={{ marginBottom: "1rem" }}>
        <Link to="/checkout">Go to checkout</Link>
      </div>

      {menuItems.length === 0 ? (
        <p
          style={{
            fontSize: "1.2rem",
            color: "#666",
            marginTop: "2rem",
          }}
        >
          No menu items available. Check back later!
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "1.5rem",
            marginTop: "2rem",
          }}
        >
          {menuItems.map((menuItem) => (
            <div
              key={menuItem.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "1.5rem",
                backgroundColor: "#fff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-4px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <h3
                style={{
                  margin: "0 0 0.5rem 0",
                  color: "#333",
                  fontSize: "1.5rem",
                }}
              >
                {menuItem.name}
              </h3>
              {menuItem.price && (
                <p
                  style={{
                    margin: "0.5rem 0",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    color: "#646cff",
                  }}
                >
                  ${menuItem.price.toFixed(2)}
                </p>
              )}
              {menuItem.description && (
                <p
                  style={{
                    margin: "0.5rem 0 0 0",
                    color: "#666",
                    fontSize: "0.9rem",
                  }}
                >
                  {menuItem.description}
                </p>
              )}
              <button
                onClick={() => dispatch(addToCart(menuItem))}
                style={{
                  marginTop: "1rem",
                  width: "100%",
                  padding: "0.6rem 0.8rem",
                  border: "none",
                  borderRadius: "6px",
                  backgroundColor: "#1d4ed8",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Add to cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;
