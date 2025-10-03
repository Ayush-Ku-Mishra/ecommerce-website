import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import defaultSignatureImage from "../assets/MySignature.jpg";

const toBase64 = (url) =>
  fetch(url)
    .then((response) => response.blob())
    .then(
      (blob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
    );

export const generateInvoicePDF = async (
  orderData,
  companyInfo = {},
  signatureImage = defaultSignatureImage
) => {
  try {
    const {
      orderDetails,
      address,
      cart,
      paymentMethod = "Online Payment",
    } = orderData;

    // Default company info (Flipkart-style)
    const company = {
      name: "Pickora Internet Private Limited",
      address:
        "Buildings Alyssa, Begonia & Clover, Embassy Tech Village, Outer Ring Road, Devarabeesanahalli Village, Bengaluru, Bengaluru, Karnataka, IN - 560103",
      gstin: "29AACCF0683K1ZD",
      cin: "U51109KA2012PTC066107",
      email: "support@pickora.com",
      phone: "044 - 66904500",
      website: "pickora.netlify.app",
      ...companyInfo,
    };

    // Calculate totals with proper GST breakdown
    const subtotal =
      cart?.reduce(
        (sum, item) =>
          sum + (item.originalPrice || item.price || 0) * (item.quantity || 1),
        0
      ) || 0;

    const totalDiscount =
      cart?.reduce((discountSum, item) => {
        const original = item.originalPrice || item.price || 0;
        const current = item.price || 0;
        const qty = item.quantity || 1;
        const discountPerItem = original > current ? original - current : 0;
        return discountSum + discountPerItem * qty;
      }, 0) || 0;

    const taxableAmount = subtotal - totalDiscount;
    const gstRate = 0.18; // 18% GST
    const taxableValue = taxableAmount / (1 + gstRate);
    const igst = taxableValue * gstRate;
    const grandTotal = taxableValue + igst;

    // Create PDF
    const doc = new jsPDF();
    const isCancelled = orderData.orderDetails?.status === "cancelled";
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Modern soothing color scheme - Ocean Breeze palette
    const primaryColor = [32, 164, 243]; // Ocean Blue
    const accentColor = [255, 138, 101]; // Soft Coral
    const successColor = [76, 175, 147]; // Seafoam Green
    const darkColor = [44, 62, 80]; // Midnight Blue
    const lightBg = [245, 248, 250]; // Cloud White
    const warmGray = [120, 144, 156]; // Warm Gray
    const cancelledRed = [220, 53, 69]; // Bootstrap danger red

    // Decorative header with gradient effect
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 50, "F");

    // Accent stripe
    doc.setFillColor(...accentColor);
    doc.rect(0, 47, pageWidth, 3, "F");

    // Tax Invoice - centered at top
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(
      isCancelled ? "CANCELLED INVOICE" : "TAX INVOICE",
      pageWidth / 2,
      25,
      { align: "center" }
    );

    // Company name and GSTIN on left
    doc.setFontSize(14);
    doc.text(company.name.split(" ")[0], 15, 22);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`GSTIN: ${company.gstin}`, 15, 40);

    // Invoice number badge (top right)
    const badgeX = pageWidth - 65;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(badgeX, 12, 50, 26, 3, 3, "F");

    doc.setTextColor(...primaryColor);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE #", badgeX + 25, 18, { align: "center" });

    doc.setFontSize(10);
    const invoiceNum = `INV${Date.now().toString().slice(-8)}`;
    doc.text(invoiceNum, badgeX + 25, 26, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...warmGray);
    const invoiceDate = new Date().toLocaleDateString("en-GB");
    doc.text(`Invoice Date: ${invoiceDate}`, badgeX + 25, 33, {
      align: "center",
    });

    // Add CANCELLED watermark if order is cancelled
    if (isCancelled) {
      doc.saveGraphicsState();
      doc.setGState(new doc.GState({ opacity: 0.15 }));
      
      doc.setTextColor(255, 0, 0);
      doc.setFontSize(60);
      doc.setFont("helvetica", "bold");
      
      // Calculate center position
      const centerX = pageWidth / 2;
      const centerY = pageHeight / 2;
      
      // Rotate and draw text at 45 degrees
      doc.text("CANCELLED", centerX, centerY, {
        align: "center",
        angle: 45,
      });
      
      doc.setGState(new doc.GState({ opacity: 1.0 }));
      doc.restoreGraphicsState();
    }

    let currentY = 65;

    // Add red cancellation banner if cancelled
    if (isCancelled) {
      doc.setFillColor(...cancelledRed);
      doc.roundedRect(15, currentY, pageWidth - 30, 12, 2, 2, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("ORDER CANCELLED", pageWidth / 2, currentY + 8, { align: "center" });
      currentY += 18;
    }

    // Ship-from address section
    doc.setFillColor(...lightBg);
    doc.roundedRect(15, currentY, pageWidth - 30, 22, 2, 2, "F");

    doc.setTextColor(...darkColor);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("Ship-from Address:", 20, currentY + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    const addressLines = doc.splitTextToSize(company.address, pageWidth - 50);
    let addrY = currentY + 6;
    addressLines.forEach((line, index) => {
      if (index < 3) {
        addrY += 4;
        doc.text(line, 20, addrY);
      }
    });

    currentY += 30;

    // Order details and billing - side by side cards
    const cardWidth = (pageWidth - 40) / 2;
    const cardHeight = isCancelled && orderDetails?.cancelledDate ? 42 : 35;

    // Order Details Card (Left)
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.roundedRect(15, currentY, cardWidth, cardHeight, 3, 3, "FD");

    doc.setFillColor(...primaryColor);
    doc.rect(15, currentY, cardWidth, 8, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("ORDER DETAILS", 20, currentY + 5.5);

    doc.setTextColor(...darkColor);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(`Order ID:`, 20, currentY + 15);
    doc.setFont("helvetica", "bold");
    doc.text(
      orderDetails?.orderId || "OD" + Date.now().toString().slice(-15),
      38,
      currentY + 15
    );

    doc.setFont("helvetica", "normal");
    doc.text(`Order Date:`, 20, currentY + 22);
    doc.setFont("helvetica", "bold");
    const rawOrderDate = orderDetails?.orderDate || new Date();
    let formattedOrderDate;

    const d = new Date(rawOrderDate);
    if (!isNaN(d)) {
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      formattedOrderDate = `${day}/${month}/${year}`;
    } else {
      formattedOrderDate = String(rawOrderDate);
    }

    doc.text(formattedOrderDate, 40, currentY + 22);

    doc.setFont("helvetica", "normal");
    doc.text(`Payment:`, 20, currentY + 29);
    doc.setFont("helvetica", "bold");
    
    // Show payment status based on order status
    if (isCancelled) {
      doc.setTextColor(...cancelledRed);
      doc.text("Cancelled", 38, currentY + 29);
    } else {
      doc.setTextColor(...successColor);
      doc.text(paymentMethod, 38, currentY + 29);
    }

    // Add cancelled date if available
    if (isCancelled && orderDetails?.cancelledDate) {
      doc.setTextColor(...darkColor);
      doc.setFont("helvetica", "normal");
      doc.text(`Cancelled:`, 20, currentY + 36);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...cancelledRed);
      
      const cancelDate = new Date(orderDetails.cancelledDate);
      const cancelDateStr = `${String(cancelDate.getDate()).padStart(2, "0")}/${String(cancelDate.getMonth() + 1).padStart(2, "0")}/${cancelDate.getFullYear()}`;
      doc.text(cancelDateStr, 42, currentY + 36);
    }

    // Billing Address Card (Right)
    const rightCardX = 15 + cardWidth + 10;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...accentColor);
    doc.setLineWidth(0.5);
    doc.roundedRect(rightCardX, currentY, cardWidth, cardHeight, 3, 3, "FD");

    doc.setFillColor(...accentColor);
    doc.rect(rightCardX, currentY, cardWidth, 8, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("BILLING ADDRESS", rightCardX + 5, currentY + 5.5);

    doc.setTextColor(...darkColor);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    const billingName = address?.name || "Customer Name";
    const billingNameLines = doc.splitTextToSize(billingName, cardWidth - 10);
    let billingY = currentY + 15;
    billingNameLines.forEach((line) => {
      doc.text(line, rightCardX + 5, billingY);
      billingY += 3.5;
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    const billingLines = [
      address?.address_line || "Address Line 1",
      `${address?.locality || "Locality"}, ${address?.city || "City"}`,
      `${address?.state || "State"} - ${address?.pincode || "000000"}`,
      `Phone: ${address?.phone ? "XXXXXXXXXX" : "XXXXXXXXXX"}`,
    ];

    const maxBillingY = currentY + cardHeight - 2;
    billingLines.forEach((line) => {
      if (billingY < maxBillingY) {
        const wrappedLines = doc.splitTextToSize(line, cardWidth - 10);
        wrappedLines.forEach((wrapped) => {
          if (billingY < maxBillingY) {
            doc.text(wrapped, rightCardX + 5, billingY);
            billingY += 3.5;
          }
        });
      }
    });

    currentY += cardHeight + 10;

    // Items Table with modern styling
    const tableData = cart.map((item, index) => {
      const grossAmount = (item.originalPrice || item.price) * item.quantity;
      const discount =
        ((item.originalPrice || item.price) - item.price) * item.quantity;
      const taxableValue = (item.price * item.quantity) / 1.18;
      const igst = taxableValue * 0.18;
      const total = item.price * item.quantity;

      return [
        `SAC: ${item.sac || "998599"}`,
        {
          content: `${item.title || item.name}\nIGST: 18.0 %`,
          styles: { fontSize: 7, cellPadding: 2 },
        },
        item.quantity,
        grossAmount.toFixed(2),
        discount.toFixed(2),
        taxableValue.toFixed(2),
        igst.toFixed(2),
        total.toFixed(2),
      ];
    });

    // Total row calculations
    const totalGrossAmount = cart.reduce(
      (sum, item) => sum + (item.originalPrice || item.price) * item.quantity,
      0
    );
    const totalDiscountAmount = cart.reduce(
      (sum, item) =>
        sum + ((item.originalPrice || item.price) - item.price) * item.quantity,
      0
    );
    const totalTaxableValue = grandTotal / 1.18;
    const totalIGST = totalTaxableValue * 0.18;
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

    tableData.push([
      "",
      { content: "Total", styles: { fontStyle: "bold", fillColor: lightBg } },
      {
        content: totalQuantity.toString(),
        styles: { fontStyle: "bold", fillColor: lightBg },
      },
      {
        content: totalGrossAmount.toFixed(2),
        styles: { fontStyle: "bold", fillColor: lightBg },
      },
      {
        content: totalDiscountAmount.toFixed(2),
        styles: { fontStyle: "bold", fillColor: lightBg },
      },
      {
        content: totalTaxableValue.toFixed(2),
        styles: { fontStyle: "bold", fillColor: lightBg },
      },
      {
        content: totalIGST.toFixed(2),
        styles: { fontStyle: "bold", fillColor: lightBg },
      },
      {
        content: grandTotal.toFixed(2),
        styles: { fontStyle: "bold", fillColor: lightBg },
      },
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [
        [
          "Description",
          "",
          "Qty",
          "Gross\nAmount Rs.",
          "Discount",
          "Taxable\nvalue Rs.",
          "IGST\nRs.",
          "Total Rs.",
        ],
      ],
      body: tableData,
      theme: "grid",
      styles: {
        fontSize: 7,
        cellPadding: 3,
        lineColor: [220, 230, 240],
        lineWidth: 0.1,
        textColor: darkColor,
      },
      headStyles: {
        fillColor: isCancelled ? cancelledRed : primaryColor,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center",
        valign: "middle",
        fontSize: 7.5,
      },
      columnStyles: {
        0: { cellWidth: 25, halign: "left" },
        1: { cellWidth: 50, halign: "left" },
        2: { cellWidth: 12, halign: "center" },
        3: { cellWidth: 20, halign: "right" },
        4: { cellWidth: 18, halign: "right" },
        5: { cellWidth: 20, halign: "right" },
        6: { cellWidth: 15, halign: "right" },
        7: { cellWidth: 20, halign: "right" },
      },
      alternateRowStyles: {
        fillColor: [252, 253, 254],
      },
      margin: { left: 15, right: 15 },
    });

    const finalY = doc.lastAutoTable.finalY + 12;

    // Grand Total Section - Single line format
    const totalBoxWidth = 80;
    const totalBoxX = pageWidth - totalBoxWidth - 15;

    const totalBoxColor = isCancelled ? cancelledRed : successColor;
    doc.setFillColor(...totalBoxColor);
    doc.roundedRect(totalBoxX, finalY, totalBoxWidth, 12, 3, 3, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    const totalText = `Grand Total: Rs. ${grandTotal.toFixed(2)}`;
    doc.text(totalText, totalBoxX + 5, finalY + 8);

    // Signature section
    const sigY = finalY + 25;
    doc.setTextColor(...darkColor);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("Pickora Internet Private Limited", pageWidth - 15, sigY, {
      align: "right",
    });

    // Signature box with modern styling
    const sigBoxY = sigY + 3;
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(pageWidth - 50, sigBoxY, 35, 18, 2, 2, "FD");

    // Convert and add the signature image
    if (signatureImage) {
      const imgData = await toBase64(signatureImage);
      doc.addImage(imgData, "JPEG", pageWidth - 48, sigBoxY + 2, 31, 14);
    }

    doc.setTextColor(...darkColor);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text("Authorized Signatory", pageWidth - 15, sigBoxY + 23, {
      align: "right",
    });

    // Footer with modern design
    const footerY = pageHeight - 28;

    // Decorative footer bar
    doc.setFillColor(...lightBg);
    doc.rect(0, footerY - 5, pageWidth, 33, "F");

    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(1);
    doc.line(15, footerY - 5, pageWidth - 15, footerY - 5);

    // Company branding in footer
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text("Pickora", pageWidth - 25, footerY + 3);

    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...accentColor);
    doc.text("Thank You!", pageWidth - 25, footerY + 8);
    doc.setFontSize(6);
    doc.setTextColor(...warmGray);
    doc.text("for shopping with us", pageWidth - 25, footerY + 11);

    // Footer info
    doc.setTextColor(...darkColor);
    doc.setFontSize(6);
    doc.setFont("helvetica", "normal");
    doc.text(`Regd. office: ${company.name}`, 15, footerY + 2);
    doc.text(`${company.address}`, 15, footerY + 6);
    doc.text(`CIN: ${company.cin}`, 15, footerY + 10);
    doc.text(
      `Contact: ${company.phone} | ${company.website}`,
      15,
      footerY + 16
    );

    // Thank you note and warranty message
    doc.setFontSize(8);
    doc.setTextColor(...darkColor);
    doc.text(
      isCancelled ? "Order Cancelled - Refund processed as per policy" : "Thank you for your business!",
      pageWidth / 2,
      footerY + 18,
      { align: "center" }
    );

    doc.setFontSize(7);
    doc.setTextColor(...cancelledRed);
    doc.setFont("helvetica", "italic");
    doc.text(
      isCancelled
        ? "*This cancelled invoice is for your records only."
        : "*Keep this invoice and manufacturer box for warranty purposes.",
      pageWidth / 2,
      footerY + 23,
      { align: "center" }
    );

    // Save PDF
    doc.save(`Invoice-${orderDetails?.orderId || invoiceNum}.pdf`);
  } catch (error) {
    console.error("Error generating invoice:", error);
    throw new Error("Failed to generate invoice: " + error.message);
  }
};

export default generateInvoicePDF;