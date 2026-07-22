"use client";

import store from "@/redux/store";
import { Provider } from "react-redux";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <Toaster position="top-center" richColors closeButton />
      {children}
    </Provider>
  );
}