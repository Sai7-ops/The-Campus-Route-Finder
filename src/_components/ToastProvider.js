"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ToastProvider({ children }) {
  return (
    <>
      {children}
      <ToastContainer
        position="bottom-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastClassName="!rounded-2xl !border !border-border/80 !bg-card/95 !text-foreground !backdrop-blur-xl !shadow-2xl !font-sans !p-4"
        bodyClassName="!text-xs !leading-relaxed !font-medium !text-foreground"
        progressClassName="!bg-primary"
      />
    </>
  );
}