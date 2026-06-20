import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/Sales";
import Users from "./pages/Settings";
import Products from "./pages/Products";
import Transactions from "./pages/Transactions";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Sales from "./pages/Sales";
import Eodreport from "./pages/Eodreport";
import Expense from "./pages/Expense";
import Inventory from "./pages/Inventory";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Sales />} />
        <Route path="sales" element={<Sales />} />
        <Route path="products" element={<Products />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        <Route path="expense" element={<Expense />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="eodreport" element={<Eodreport />} />
      </Route>
    </Routes>
  );
}

export default App;
