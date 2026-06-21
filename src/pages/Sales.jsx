import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";

import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function Sales() {
  const [chartData, setChartData] = useState(null);
  const [summary, setSummary] = useState({
    todaySales: 0,
    totalTransactions: 0,
    bestProduct: "-",
    productSales: {},
  });

  const endToday = new Date();
  endToday.setHours(23, 59, 59, 999);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "orders"));

      const transactions = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        const dateObj = data.createdAt?.seconds
          ? new Date(data.createdAt.seconds * 1000)
          : new Date(data.createdAt);

        transactions.push({
          totalPrice: data.totalPrice,
          date: dateObj,
        });
      });

      // 🔥 Ambil minggu ini (Senin - Minggu)
      const now = new Date();
      const day = now.getDay(); // 0 = Minggu, 1 = Senin

      const diffToMonday = day === 0 ? -6 : 1 - day;
      const monday = new Date(now);
      monday.setDate(now.getDate() + diffToMonday);
      monday.setHours(0, 0, 0, 0);

      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);

      // 🔥 Filter transaksi minggu ini
      const weeklyTransactions = transactions.filter(
        (trx) => trx.date >= monday && trx.date <= sunday,
      );

      // 🔥 Inisialisasi hari
      const daysMap = {
        Senin: 0,
        Selasa: 0,
        Rabu: 0,
        Kamis: 0,
        Jumat: 0,
        Sabtu: 0,
        Minggu: 0,
      };

      // 🔥 Mapping index hari ke nama
      const dayNames = [
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu",
      ];

      weeklyTransactions.forEach((trx) => {
        const dayName = dayNames[trx.date.getDay()];
        daysMap[dayName] += trx.totalPrice;
      });

      // 🔥 Urutan Senin → Minggu
      const labels = [
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu",
        "Minggu",
      ];

      const values = labels.map((day) => daysMap[day]);

      setChartData({
        labels,
        datasets: [
          {
            label: "Penjualan Mingguan (Rp)",
            data: values,
          },
        ],
      });

      // 🔥 Hitung hari ini
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let todaySales = 0;
      let totalTransactions = 0;

      // 🔥 Untuk produk terlaris
      const productMap = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        const dateObj = data.createdAt?.seconds
          ? new Date(data.createdAt.seconds * 1000)
          : new Date(data.createdAt);

        // ✅ Total hari ini
        if (dateObj >= today && dateObj <= endToday) {
          todaySales += Number(data.totalPrice) || 0;
          totalTransactions += 1; // ✅ hitung hanya hari ini

          if (data.items) {
            data.items.forEach((item) => {
              const name = item.name;
              const qty = item.qty || 1;

              if (!productMap[name]) productMap[name] = 0;
              productMap[name] += qty;
            });
          }
        }

        // ✅ Produk terlaris (asumsi ada items array)
        // ✅ HANYA HITUNG PRODUK HARI INI
      });

      // 🔥 Cari produk terlaris
      let bestProduct = "-";
      let max = 0;

      for (const product in productMap) {
        if (productMap[product] > max) {
          max = productMap[product];
          bestProduct = product;
        }
      }

      // 🔥 Set summary
      setSummary({
        todaySales,
        totalTransactions,
        bestProduct,
        productSales: productMap,
      });
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Penjualan Mingguan",
      },
      tooltip: {
        callbacks: {
          label: (ctx) => "Rp " + ctx.raw.toLocaleString(),
        },
      },
    },
  };

  const todayDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div style={{ padding: "20px" }}>
      <h1>Weekly Sales Overview</h1>

      <div className="sales-layout">
        {/* 📊 CHART */}
        <div
          className="chart-container"
          style={{
            flex: 2,
            width: "100%",
            height: window.innerWidth <= 768 ? "400px" : "500px",
          }}
        >
          {chartData ? (
            <Bar data={chartData} options={options} />
          ) : (
            <p>Loading data...</p>
          )}
        </div>

        {/* 📦 SUMMARY */}
        <div
          className="summary-container"
          style={{
            flex: 1,
            width: "100%",
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Daily report</span>
            <span style={{ fontSize: "14px", color: "gray" }}>{todayDate}</span>
          </h3>
          <br />
          <p>
            <strong>Today Sales:</strong> <br />
            Rp {summary.todaySales.toLocaleString()}
          </p>
          <br />
          <p>
            <strong>Total Transactions:</strong> <br />
            {summary.totalTransactions}
          </p>
          <br />
          <p>
            <strong>Best Selling Product:</strong> <br />
            {summary.bestProduct}
          </p>
          <br />
          <p>
            <strong>Product Sales:</strong>
          </p>

          <ul style={{ marginTop: "10px", listStyle: "none", padding: 0 }}>
            {Object.entries(summary.productSales).map(([name, qty]) => (
              <li
                key={name}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "5px 0",
                  borderBottom: "1px solid #eee",
                }}
              >
                <span>{name}</span>
                <strong>{qty} pcs</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
