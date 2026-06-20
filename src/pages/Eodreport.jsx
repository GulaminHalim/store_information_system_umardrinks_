import React, { useEffect, useState } from "react";

import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

import { db } from "../firebase";

export default function Eodreport() {
  const [orders, setOrders] = useState([]);

  // CASH
  const [cashReceived, setCashReceived] = useState("");
  const [cashDifference, setCashDifference] = useState(0);

  // QRIS
  const [qrisReceived, setQrisReceived] = useState("");
  const [qrisDifference, setQrisDifference] = useState(0);

  // =========================
  // AMBIL DATA ORDERS
  // =========================
  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orderData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setOrders(orderData);
    });

    return () => unsubscribe();
  }, []);

  // =========================
  // FILTER TANGGAL HARI INI
  // =========================
  const today = new Date();

  const isToday = (order) => {
    if (!order.createdAt || typeof order.createdAt.toDate !== "function") {
      return false;
    }

    const orderDate = order.createdAt.toDate();

    return (
      orderDate.toLocaleDateString("id-ID") ===
      today.toLocaleDateString("id-ID")
    );
  };

  // =========================
  // TOTAL CASH
  // =========================
  const totalCashToday = orders
    .filter((order) => {
      const paymentType = order.paymentType?.toString().toLowerCase().trim();

      return paymentType?.includes("cash") && isToday(order);
    })
    .reduce((total, order) => {
      const cleanPrice = String(order.totalPrice || 0).replace(/[^\d]/g, "");

      return total + Number(cleanPrice || 0);
    }, 0);

  // =========================
  // TOTAL QRIS
  // =========================
  const totalQrisToday = orders
    .filter((order) => {
      const paymentType = order.paymentType?.toString().toLowerCase().trim();

      return paymentType?.includes("qris") && isToday(order);
    })
    .reduce((total, order) => {
      const cleanPrice = String(order.totalPrice || 0).replace(/[^\d]/g, "");

      return total + Number(cleanPrice || 0);
    }, 0);

  // =========================
  // PROCESS CASH
  // =========================
  const handleCashProcess = () => {
    const received = Number(cashReceived) || 0;

    const difference = received - totalCashToday;

    setCashDifference(difference);
  };

  // =========================
  // PROCESS QRIS
  // =========================
  const handleQrisProcess = () => {
    const received = Number(qrisReceived) || 0;

    // TOTAL QRIS - INPUT MERCHANT BCA
    const difference = received - totalQrisToday;

    setQrisDifference(difference);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>End Of Day Report</h1>

      {/* WRAPPER FLEX */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        {/* ========================= */}
        {/* LAPORAN TUNAI */}
        {/* ========================= */}
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "20px",
            maxWidth: "400px",
            width: "100%",
          }}
        >
          <h3>Laporan Tunai</h3>

          {/* TOTAL CASH */}
          <div style={{ marginBottom: "15px" }}>
            <label>Total Payment Cash Hari Ini</label>

            <input
              type="number"
              readOnly
              value={totalCashToday}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "5px",
                backgroundColor: "#f5f5f5",
              }}
            />
          </div>

          {/* INPUT CASH */}
          <div style={{ marginBottom: "15px" }}>
            <label>Uang Tunai Diterima</label>

            <input
              type="number"
              value={cashReceived}
              onChange={(e) => setCashReceived(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "5px",
              }}
            />
          </div>

          {/* SELISIH */}
          <div>
            <label>Selisih</label>

            <input
              type="number"
              readOnly
              value={cashDifference}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "5px",
                backgroundColor: "#f5f5f5",
              }}
            />
          </div>

          {/* BUTTON */}
          <button
            type="button"
            onClick={handleCashProcess}
            style={{
              width: "100%",
              marginTop: "20px",
              padding: "10px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Process
          </button>
        </div>

        {/* ========================= */}
        {/* LAPORAN QRIS */}
        {/* ========================= */}
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "20px",
            maxWidth: "400px",
            width: "100%",
          }}
        >
          <h3>Laporan QRIS</h3>

          {/* TOTAL QRIS */}
          <div style={{ marginBottom: "15px" }}>
            <label>Total Payment Qris Hari Ini</label>

            <input
              type="number"
              readOnly
              value={totalQrisToday}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "5px",
                backgroundColor: "#f5f5f5",
              }}
            />
          </div>

          {/* INPUT QRIS */}
          <div style={{ marginBottom: "15px" }}>
            <label>Qris di Merchant BCA</label>

            <input
              type="number"
              value={qrisReceived}
              onChange={(e) => setQrisReceived(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "5px",
              }}
            />
          </div>

          {/* SELISIH */}
          <div>
            <label>Selisih</label>

            <input
              type="number"
              readOnly
              value={qrisDifference}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "5px",
                backgroundColor: "#f5f5f5",
              }}
            />
          </div>

          {/* BUTTON */}
          <button
            type="button"
            onClick={handleQrisProcess}
            style={{
              width: "100%",
              marginTop: "20px",
              padding: "10px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Process
          </button>
        </div>
      </div>
    </div>
  );
}
