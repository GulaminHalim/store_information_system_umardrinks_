import React, { forwardRef } from "react";

const Receipt = forwardRef(({ order }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        width: "280px",
        padding: "10px",
        fontSize: "17px",
        fontWeight: "bold",
      }}
    >
      <h5 style={{ textAlign: "center", fontWeight: "bold" }}>UMAR DRINKS</h5>
      <p style={{ textAlign: "center", fontSize: "16px", margin: "0" }}>
        Potato Bolognese, Mac & Cheese, <br /> Fire Chicken Popcorn
      </p>
      <p style={{ textAlign: "center", margin: "0" }}>
        (Seberang gerbang UNAS Pasar Minggu)
      </p>
      <p style={{ textAlign: "center", margin: "0 0 30px 0" }}>
        Jl. Sawo Manila, Jati Padang, Jakarta Selatan
      </p>
      <p style={{ margin: "0" }}> Phone/Wa : 085891266106</p>

      <hr />

      <p>Tanggal: {new Date().toLocaleString()}</p>
      <p>Customer: {order.customerName}</p>
      <p>Tipe pembayaran: {order.paymentType}</p>
      <hr />

      {order.items.map((item, i) => (
        <div
          key={i}
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <span>
            {item.qty} x {item.name}
          </span>
          <span>Rp {item.qty * item.price}</span>
        </div>
      ))}

      <hr />
      <strong style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Total</span>
        <span>Rp {order.totalPrice}</span>
      </strong>

      <hr />
      <p style={{ textAlign: "center" }}>Terima kasih 🙏</p>
    </div>
  );
});

export default Receipt;
