'use client';
import { ScaleLoader } from "react-spinners";

export default function Preloader() {
  return (
    <>
      <div className="w-full flex justify-center items-center min-h-[50vh]">
        <ScaleLoader
          color="#aaa"
          loading={true}
          speedMultiplier={4}
        />
      </div>
    </>
  );
}