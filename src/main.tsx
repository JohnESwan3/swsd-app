import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Dashboard from "./pages/Dashboard";
import NewSolution from "./pages/NewSolution";
import Settings from "./pages/Settings";
import Charts from "./pages/Charts";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <App>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/new-solution" element={<NewSolution />} />
                    <Route path="/charts" element={<Charts />} />
                    <Route path="/settings" element={<Settings />} />
                </Routes>
            </App>
        </BrowserRouter>
    </React.StrictMode>,
);
