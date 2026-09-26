"use client";

export function PrintButton() {
  return (
    <button type="button" className="btn-rec" onClick={() => window.print()}>
      ⎙ Print / Save as PDF
    </button>
  );
}
