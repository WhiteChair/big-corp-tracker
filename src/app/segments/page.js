"use client";
import dynamic from "next/dynamic";
const Dashboard = dynamic(() => import("@/components/Dashboard"), { ssr: false });
const NavBar = dynamic(() => import("@/components/NavBar"), { ssr: false });

export default function SegmentsPage() {
  return (
    <>
      <NavBar />
      <Dashboard />
    </>
  );
}
