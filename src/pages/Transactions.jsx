import { useEffect, useState } from "react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
//import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import { ArrowLeft } from "lucide-react";
import Receipt from "../components/Receipt";
import Eodreport from "./Eodreport";

import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "../firebase";

export default function Transactions() {
  const [orders, setOrders] = useState([]);
  // const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const receiptRef = useRef();

  // 1. Ubah konfigurasi useReactToPrint agar lebih stabil
  const handlePrint = useReactToPrint({
    contentRef: receiptRef, // Gunakan contentRef untuk versi terbaru react-to-print
    onAfterPrint: () => setSelectedOrder(null), // Reset setelah cetak
  });

  // 2. Fungsi penangan klik yang lebih aman
  const onPrintButtonClick = (order) => {
    setSelectedOrder(order);
    // Berikan sedikit delay (macrotask) agar React sempat merender Receipt
    setTimeout(() => {
      handlePrint();
    }, 100);
  };

  // Ambil data order dari Firestore (REALTIME)
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
  }, []); // ← INI WAJIB

  useEffect(() => {
    if (orders.length === 0) return;

    const resetNotification = async () => {
      const pendingOrders = orders.filter(
        (order) => order.hasNewOrder === true,
      );

      for (const order of pendingOrders) {
        await updateDoc(doc(db, "orders", order.id), {
          hasNewOrder: false,
        });
      }
    };

    resetNotification();
  }, [orders]);

  // Update status order
  const handleStatusChange = async (orderId) => {
    const orderRef = doc(db, "orders", orderId);

    await updateDoc(orderRef, {
      status: "completed",
    });
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp) return "-";

    const date = timestamp.toDate(); // convert Firestore Timestamp
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Container className="py-4" style={{ maxWidth: "1000px" }}>
      {/* BACK BUTTON */}

      {/*}
      <Button
        variant="link"
        className="d-flex align-items-center gap-2 mb-3 text-decoration-none"
        onClick={() => navigate("/dashboard")}
      >
        <ArrowLeft size={20} />
        Back to Dashboard
      </Button>
      */}

      <h2 className="text-center mb-4 fw-bold">Transactions</h2>

      {orders.length === 0 ? (
        <p className="text-center text-muted">No orders yet...</p>
      ) : (
        orders.map((order) => (
          <Card key={order.id} className="mb-3 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div>
                  <small className="text-muted">
                    {formatDateTime(order.createdAt)}
                  </small>
                  <br />
                  <strong>Customer:</strong> {order.customerName}
                  <br />
                  <strong>Payment type:</strong> {order.paymentType}
                  <br />
                  <strong>Total:</strong> Rp {order.totalPrice}
                </div>

                <div className="d-flex align-items-center gap-3">
                  <Badge
                    bg={order.status === "pending" ? "warning" : "success"}
                  >
                    {order.status}
                  </Badge>

                  <Form.Check
                    type="checkbox"
                    disabled={order.status === "completed"}
                    checked={order.status === "completed"}
                    onChange={() => handleStatusChange(order.id)}
                  />

                  {/* BUTTON PRINT MUNCUL JIKA COMPLETED */}
                  {order.status === "completed" && (
                    <Button size="sm" onClick={() => onPrintButtonClick(order)}>
                      Print
                    </Button>
                  )}
                </div>
              </div>

              <ListGroup variant="flush">
                {order.items.map((item, index) => (
                  <ListGroup.Item key={index}>
                    {item.qty} x {item.name} — Rp {item.price * item.qty}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        ))
      )}

      {/* 🔥 STRUK PRINT (PALING BAWAH) */}
      {selectedOrder && (
        <div
          style={{
            position: "absolute",
            top: "-10000px",
            left: "-10000px",
          }}
        >
          <Receipt ref={receiptRef} order={selectedOrder} />
        </div>
      )}
    </Container>
  );
}
