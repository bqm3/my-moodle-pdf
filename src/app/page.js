"use client";
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function Home() {
  const [file, setFile] = useState(
    "https://api.office.pmcweb.vn/upload/filevb/Du_an_Manh_test/YCTT-Du_an_Manh_test-22_05_2025%2011_48.pdf"
  );
  const [numPages, setNumPages] = useState(null);
  const [pdfDimensions, setPdfDimensions] = useState({ width: 1, height: 1 });
  const [positions, setPositions] = useState([]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const onPageLoadSuccess = (page) => {
    const viewport = page.getViewport({ scale: 1 });
    setPdfDimensions({
      width: viewport.width, // chính xác theo point
      height: viewport.height,
    });
  };

  const handlePDFClick = (event, pageNumber) => {
    const canvas = event.target.closest("canvas");
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();

    const scaleX = pdfDimensions.width / rect.width;
    const scaleY = pdfDimensions.height / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const yFromTop = (event.clientY - rect.top) * scaleY;

    // ✅ Chuyển sang toạ độ gốc iText: (0,0) ở góc trái dưới
    const x_iText = x;
    const y_iText = pdfDimensions.height - yFromTop;

    const fieldName = "signature";
    setPositions((prev) => [
      ...prev,
      { fieldName, x: x_iText, y: y_iText, pageNumber },
    ]);

    console.log("📌 Vị trí (iText):", {
      fieldName,
      x: x_iText.toFixed(2),
      y: y_iText.toFixed(2),
      page: pageNumber,
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>📄 Xem PDF từ Google Drive</h1>
      <p>Click vào bất kỳ chỗ nào trên trang để lấy tọa độ PDF (points)</p>

      <div style={{ maxWidth: "595px", marginTop: 20 }}>
        <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from(new Array(numPages || 0), (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              width={595}
              onLoadSuccess={onPageLoadSuccess}
              onClick={(event) => handlePDFClick(event, index + 1)}
            />
          ))}
        </Document>
      </div>

      {positions.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h3>📍 Tọa độ đã chọn:</h3>
          <ul>
            {positions.map(({ fieldName, x, y, pageNumber }, idx) => (
              <li key={idx}>
                <b>{fieldName}</b> – Trang: {pageNumber} – X: {x.toFixed(2)} –
                Y: {y.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
