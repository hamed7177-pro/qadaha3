/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import CashFlow from "./pages/CashFlow";
import Simulator from "./pages/Simulator";
import Certificate from "./pages/Certificate";
import Chat from "./pages/Chat";
import ImprovementPlan from "./pages/ImprovementPlan";
import LinkAccounts from "./pages/LinkAccounts";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/link-accounts" element={<LinkAccounts />} />
          <Route path="/cash-flow" element={<CashFlow />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/certificate" element={<Certificate />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/improvement-plan" element={<ImprovementPlan />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
