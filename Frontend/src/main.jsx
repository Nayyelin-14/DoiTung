import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { Toaster } from "sonner";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import persistStore from "redux-persist/es/persistStore";
import Store from "./store/Store.js";
import "./utils/i18n.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const persistor = persistStore(Store);

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <Provider store={Store}>
      <PersistGate persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>

        <Toaster position="top-center" richColors closeButton />
      </PersistGate>
    </Provider>
  </>
);
