import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { Toaster } from "react-hot-toast";
import { ClassProvider } from "./context/ClassContext.jsx";
import { WalletProvider } from "./context/WalletContext.jsx";
import { FeedbackProvider } from "./context/FeedbackContext.jsx";
import { QuestionProvider } from "./context/QuestionContext.jsx";
import { AvatarProvider } from "./context/AvatarContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <ClassProvider>
      <WalletProvider>
        <FeedbackProvider>
          <QuestionProvider>
            <AvatarProvider>
              <Toaster />
              <App />
            </AvatarProvider>
          </QuestionProvider>
        </FeedbackProvider>
      </WalletProvider>
    </ClassProvider>
  </AuthProvider>
);
