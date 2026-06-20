import React, { useEffect, useState } from "react";

import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

import { db } from "../firebase";

export default function Inventory() {
  const [inventoryData, setInventoryData] = useState([]);

  const generateInventory = (orders) => {
    const today = new Date().toLocaleDateString("id-ID");

    let todaySales = 0;

    orders.forEach((order) => {
      if (!order.createdAt || typeof order.createdAt.toDate !== "function") {
        return;
      }

      const orderDate = order.createdAt.toDate().toLocaleDateString("id-ID");

      if (orderDate === today) {
        if (Array.isArray(order.items)) {
          order.items.forEach((item) => {
            if (item.name === "Paper lunch box") {
              todaySales += item.qty || 0;
            }
          });
        }
      }
    });
    // stok awal FIX
    const openingStock = 53;

    const reject = 0;
    const mealAllowance = 0;

    const endingStock = openingStock - todaySales - reject - mealAllowance;

    setInventoryData([
      {
        date: today,
        itemName: "Paper lunch box",
        openingStock,
        sales: todaySales,
        reject,
        mealAllowance,
        endingStock,
      },
    ]);
  };
  // =========================
  // AMBIL DATA ORDERS
  // =========================
  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      generateInventory(orders);
    });

    return () => unsubscribe();
  }, []);

  // =========================
  // GENERATE INVENTORY
  // =========================

  return (
    <div style={{ padding: "20px" }}>
      <h1>Halaman Inventory</h1>

      <div style={{ overflowX: "auto", marginTop: "20px" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <th style={thStyle}>Tanggal</th>

              <th style={thStyle}>Nama Barang</th>

              <th style={thStyle}>Stok Awal</th>

              <th style={thStyle}>Penjualan</th>

              <th style={thStyle}>Reject</th>

              <th style={thStyle}>Meal Allowance</th>

              <th style={thStyle}>Stok Akhir</th>
            </tr>
          </thead>

          <tbody>
            {inventoryData.map((item, index) => (
              <tr key={index}>
                <td style={tdStyle}>{item.date}</td>

                <td style={tdStyle}>{item.itemName}</td>

                <td style={tdStyle}>{item.openingStock}</td>

                <td style={tdStyle}>{item.sales}</td>

                <td style={tdStyle}>{item.reject}</td>

                <td style={tdStyle}>{item.mealAllowance}</td>

                <td style={tdStyle}>{item.endingStock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// =========================
// STYLE
// =========================
const thStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  textAlign: "center",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  textAlign: "center",
};
