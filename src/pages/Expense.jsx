import React, { useEffect, useState } from "react";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

export default function Expense() {
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");
  const [expenses, setExpenses] = useState([]);

  // =========================
  // AMBIL DATA FIRESTORE
  // =========================
  useEffect(() => {
    const q = query(collection(db, "expenses"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const expenseData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setExpenses(expenseData);
    });

    return () => unsubscribe();
  }, []);

  // =========================
  // HANDLE TAMBAH DATA
  // =========================
  const handleProcess = async () => {
    if (!description || !cost) {
      alert("Description dan Cost wajib diisi");
      return;
    }

    try {
      await addDoc(collection(db, "expenses"), {
        description,
        cost: Number(cost),

        // format tanggal indonesia
        date: new Date().toLocaleDateString("id-ID"),

        // timestamp firestore
        createdAt: serverTimestamp(),
      });

      // reset input
      setDescription("");
      setCost("");

      alert("Data expense berhasil disimpan");
    } catch (error) {
      console.error(error);

      alert("Gagal menyimpan data");
    }
  };

  // =========================
  // HANDLE DELETE
  // =========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus data ini?");

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "expenses", id));

      alert("Data berhasil dihapus");
    } catch (error) {
      console.error(error);

      alert("Gagal menghapus data");
    }
  };

  // =========================
  // TOTAL BIAYA
  // =========================
  const totalCost = expenses.reduce((total, item) => {
    return total + Number(item.cost || 0);
  }, 0);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Expense</h1>

      {/* FORM INPUT */}
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "20px",
          maxWidth: "500px",
          marginBottom: "30px",
        }}
      >
        {/* DESCRIPTION */}
        <div style={{ marginBottom: "15px" }}>
          <label>Description</label>

          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Masukkan deskripsi biaya"
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
            }}
          />
        </div>

        {/* COST */}
        <div style={{ marginBottom: "15px" }}>
          <label>Cost / Biaya</label>

          <input
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            placeholder="Masukkan nominal biaya"
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
            }}
          />
        </div>

        {/* BUTTON */}
        <button
          type="button"
          onClick={handleProcess}
          style={{
            width: "100%",
            padding: "12px",
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

      {/* TABEL DATA */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <th
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                }}
              >
                Tanggal
              </th>

              <th
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                }}
              >
                Description
              </th>

              <th
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                }}
              >
                Cost / Biaya
              </th>

              <th
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                }}
              >
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {expenses.map((item) => (
              <tr key={item.id}>
                <td
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                  }}
                >
                  {item.date}
                </td>

                <td
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                  }}
                >
                  {item.description}
                </td>

                <td
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                  }}
                >
                  Rp {Number(item.cost).toLocaleString("id-ID")}
                </td>

                {/* DELETE BUTTON */}
                <td
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#f44336",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {/* TOTAL */}
            <tr>
              <td
                colSpan="3"
                style={{
                  border: "1px solid #ccc",
                  padding: "12px",
                  fontWeight: "bold",
                  textAlign: "right",
                  backgroundColor: "#f5f5f5",
                }}
              >
                TOTAL BIAYA
              </td>

              <td
                style={{
                  border: "1px solid #ccc",
                  padding: "12px",
                  fontWeight: "bold",
                  backgroundColor: "#f5f5f5",
                }}
              >
                Rp {totalCost.toLocaleString("id-ID")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
