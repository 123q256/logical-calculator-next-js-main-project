import { useState } from "react";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ResultActions = ({ lang, result }) => {
  const [resultContent, setResultContent] = useState(
    "wejgydfkuygjhewaskgudrfhuyesadgiu"
  ); // Placeholder for result content

  const copyText = () => {
    navigator.clipboard.writeText(resultContent);
    toast.success("Result copied to clipboard!");
  };

  const printContentOfElement = (elementClass) => {
    const content = document.querySelector(elementClass).innerHTML;
    const printWindow = window.open("", "", "width=600,height=400");
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  };

  const generatePDF = () => {
    const resultElement = document.querySelector(".result");

    html2canvas(resultElement, {
      scale: 2,
      useCORS: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
     const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pdfWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save("result.pdf");
    });
  };

  return (
    <div className="flex justify-between items-center pb-2 border-b-2 border-b-black">
      <p className="text-1xl md:text-2xl lg:text-2xl font-semibold">
        {lang["res"]}
      </p>
      <div className="flex items-center">
        <div className="flex items-center">
          <img
            src="/icons/copy.svg" // Update path if needed
            alt="Copy Result In PDF"
            title="Copy Result In PDF"
            className="w-5 h-5 mr-3 cursor-pointer"
            onClick={copyText}
          />
          <img
            src="/icons/printer.svg" // Update path if needed
            alt="Print Result"
            title="Print Result"
            className="w-5 h-5 mr-3 cursor-pointer"
            onClick={() => printContentOfElement(".result")}
          />
          <img
            src="/icons/downloads.svg" // Update path if needed
            alt="Download Result"
            title="Download Result"
            className="w-5 h-5 cursor-pointer"
            onClick={generatePDF} // Call generatePDF on click
          />
        </div>
      </div>
    </div>
  );
};

export default ResultActions;
