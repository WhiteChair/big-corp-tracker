"use client";
import dynamic from "next/dynamic";
const BigCorpRank = dynamic(() => import("@/components/BigCorpRank"), { ssr: false });
const NavBar = dynamic(() => import("@/components/NavBar"), { ssr: false });

export default function Home() {
  return (
    <>
      <NavBar />
      <BigCorpRank />
    </>
  );
}
