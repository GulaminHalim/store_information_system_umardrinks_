import { Outlet, NavLink } from "react-router-dom";
import { useState } from "react";
import Footbar from "./Footbar";
import "../styles.css";

export default function AdminLayout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="layout">
      {/* Tombol Hamburger */}
      <button className="menu-btn" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <h2 className="logo">UmarDrinks</h2>

        <nav>
          <NavLink to="sales" onClick={() => setIsOpen(false)}>
            Sales
          </NavLink>

          <NavLink to="transactions" onClick={() => setIsOpen(false)}>
            Transactions
          </NavLink>

          <NavLink to="expense" onClick={() => setIsOpen(false)}>
            Expense
          </NavLink>

          <NavLink to="inventory" onClick={() => setIsOpen(false)}>
            Inventory
          </NavLink>

          <NavLink to="eodreport" onClick={() => setIsOpen(false)}>
            EOD
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main">
        <div className="content">
          <Outlet />
        </div>

        <Footbar />
      </main>
    </div>
  );
}
