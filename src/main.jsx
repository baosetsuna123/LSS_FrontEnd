import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { Toaster } from "react-hot-toast";
import { ClassProvider } from "./context/ClassContext.jsx";
import { WalletProvider } from "./context/WalletContext.jsx";
import { FeedbackProvider } from "./context/FeedbackContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <ClassProvider>
      <WalletProvider>
        <FeedbackProvider>
          <Toaster />
          <App />
        </FeedbackProvider>
      </WalletProvider>
    </ClassProvider>
  </AuthProvider>
);
