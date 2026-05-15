/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HomeView from './views/HomeView';
import DebtsView from './views/DebtsView';
import PaymentOptionsView from './views/PaymentOptionsView';
import PaymentMethodView from './views/PaymentMethodView';
import PixPaymentView from './views/PixPaymentView';
import BoletoView from './views/BoletoView';
import GuiaConfirmationView from './views/GuiaConfirmationView';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-surface-bg selections:bg-institutional-blue selection:text-white">
        <Header />
        
        <main className="flex-grow flex flex-col">
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/debts" element={<DebtsView />} />
            <Route path="/options" element={<PaymentOptionsView />} />
            <Route path="/method" element={<PaymentMethodView />} />
            <Route path="/payment/pix" element={<PixPaymentView />} />
            <Route path="/payment/boleto" element={<BoletoView />} />
            <Route path="/confirmation" element={<GuiaConfirmationView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <BottomNav />
      </div>
    </BrowserRouter>
  );
}
