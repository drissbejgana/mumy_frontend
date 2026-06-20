import React from "react";

export function LogoIcon({ className = "w-20 h-10" }: { className?: string }) {
  return (
    <img
      src="/logo.png"
      alt="MUMY"
      className={`${className} object-contain shrink-0`}
      draggable={false}
    />
  );
}
