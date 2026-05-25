"use client";

import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex items-center">
      <div className="flex items-center justify-center">
        <Image
          src="/logotipo.png"
          alt="Logo ho.ko AI.nalytics"
          width={150}
          height={150}
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}