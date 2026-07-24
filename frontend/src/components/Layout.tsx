import React from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <Topbar title={title} subtitle={subtitle} />
        <div className="page-content">{children}</div>
      </main>
    </div>
  );
};
