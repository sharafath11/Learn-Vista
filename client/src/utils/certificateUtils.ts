import { RefObject } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { showInfoToast } from "./Toast"; // Assuming Toast utility is available

/**
 * Creates and injects a temporary style tag to override potential oklch colors
 * with standard hex/rgb values, ensuring html2canvas compatibility.
 * This acts as a general fallback for class-based styles.
 */
const createPrintSafeStyles = () => {
  const style = document.createElement('style');
  style.id = 'print-safe-styles'; // Unique ID for easy removal
  style.innerHTML = `
    /* Overrides for common Tailwind colors that might use oklch in some configurations */
    .bg-red-50 { background-color: #fef2f2 !important; } /* Tailwind red-50 */
    .bg-blue-50 { background-color: #eff6ff !important; } /* Tailwind blue-50 */
    .bg-red-100 { background-color: #fee2e2 !important; } /* Tailwind red-100 */
    .border-red-300 { border-color: #fca5a5 !important; } /* Tailwind red-300 */
    .border-blue-200 { border-color: #bfdbfe !important; } /* Tailwind blue-200 */
    .text-indigo-600 { color: #4f46e5 !important; } /* Tailwind indigo-600 */
    .text-red-600 { color: #dc2626 !important; } /* Tailwind red-600 */
    .from-indigo-500 { --tw-gradient-from: #6366f1 !important; --tw-gradient-to: rgba(99, 102, 241, 0) !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important; } /* Tailwind indigo-500 */
    .to-blue-500 { --tw-gradient-to: #3b82f6 !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important; } /* Tailwind blue-500 */
    /* Ensure any other custom oklch colors are also overridden here */
  `;
  document.head.appendChild(style);
};

/**
 * Removes the temporary style tag injected by createPrintSafeStyles.
 */
const removePrintSafeStyles = () => {
  const style = document.getElementById('print-safe-styles');
  if (style) {
    style.remove();
  }
};

/**
 * Recursively traverses an HTML element and its children to replace
 * any computed 'oklch' color values with standard hex fallbacks as inline styles.
 * This is a direct manipulation on the cloned element before html2canvas processes it.
 *
 * @param el The HTML element to process.
 */
const removeOklchColorsFromElement = (el: HTMLElement) => {
  if (!el || typeof el.style === 'undefined') {
    return;
  }

  const style = getComputedStyle(el);
  const props = [
    "color", "backgroundColor", "borderColor",
    "borderTopColor", "borderBottomColor",
    "borderLeftColor", "borderRightColor",
    "fill", "stroke", "textDecorationColor",
    "outlineColor", "columnRuleColor"
  ];

  props.forEach((prop) => {
    const val = style.getPropertyValue(prop);
    if (val && val.includes("oklch")) {
      let fallback = "#000000"; // Default to black
      if (prop.includes("background")) {
        fallback = "#ffffff"; // White for backgrounds
      } else if (prop.includes("border") || prop.includes("outline") || prop.includes("columnRule")) {
        fallback = "#cccccc"; // Light grey for borders/outlines
      } else if (prop.includes("textDecoration")) {
        fallback = "#000000"; // Black for text decoration
      }
      el.style.setProperty(prop, fallback, "important");
    }
  });

  // Handle gradients more specifically if they are still problematic
  const backgroundImage = style.getPropertyValue('background-image');
  if (backgroundImage && backgroundImage.includes('gradient') && backgroundImage.includes('oklch')) {
    // A more complex replacement might be needed here, or ensure Tailwind
    // gradient classes are correctly overridden by createPrintSafeStyles.
    // For now, setting a solid color fallback for the background if gradient fails.
    el.style.setProperty('background-image', 'none', 'important');
    el.style.setProperty('background-color', '#ffffff', 'important'); // Fallback solid background
  }


  // Recurse for children
  Array.from(el.children).forEach((child) => {
    if (child instanceof HTMLElement) {
      removeOklchColorsFromElement(child);
    }
  });
};


/**
 * Handles the download of the certificate as a PDF.
 * It uses html2canvas to render the certificate component to an image,
 * then converts that image into a PDF using jsPDF.
 * It also includes logic to handle potential oklch color issues and
 * temporarily hides the "REVOKED" overlay if present.
 *
 * @param ref A React RefObject pointing to the HTML element of the certificate viewer.
 */
export const handleDownloadCertificate = async (
  ref: RefObject<HTMLElement | null>
) => {
  const element = ref.current;
  if (!element) {
    showInfoToast("Certificate content not ready for download.");
    return;
  }

  // Flag to track if the overlay was hidden, to ensure it's restored
  let overlayHidden = false;
  const overlay = element.querySelector(".revoked-overlay") as HTMLElement;

  try {
    // Hide overlay temporarily for cleaner PDF output
    if (overlay) {
      overlay.style.display = "none";
      overlayHidden = true;
    }

    // Inject print-safe styles to handle oklch issues via CSS rules
    createPrintSafeStyles();

    // Clone the element for manipulation to avoid altering the live DOM
    const clone = element.cloneNode(true) as HTMLElement;

    // IMPORTANT: Apply direct inline style overrides on the cloned element
    // This is the most aggressive way to ensure html2canvas doesn't see oklch.
    removeOklchColorsFromElement(clone);

    // Append clone to the DOM off-screen to allow html2canvas to render it
    clone.style.position = "fixed";
    clone.style.top = "-9999px";
    clone.style.left = "-9999px";
    clone.style.zIndex = "-1"; // Ensure it's not visible and doesn't interfere
    document.body.appendChild(clone);

    // Render PDF from the sanitized clone
    const canvas = await html2canvas(clone, {
      scale: 3, // Increase scale for higher resolution PDF
      useCORS: true, // Enable CORS for images if any are from external sources
      backgroundColor: "#ffffff", // Set a default background color
    });

    // Clean up the temporary clone and styles
    document.body.removeChild(clone);

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape", "mm", "a4"); // A4 landscape format
    const imgWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add the image to the PDF, scaling it to fit the page
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`certificate-${Date.now()}.pdf`); // Save the PDF with a unique filename

    showInfoToast("Certificate downloaded successfully!");
  } catch (err) {
    console.error("PDF generation error:", err);
    showInfoToast("Failed to download certificate.");
  } finally {
    // Ensure overlay is restored and print-safe styles are removed, even if an error occurred
    if (overlay && overlayHidden) {
      overlay.style.display = "flex";
    }
    removePrintSafeStyles();
  }
};
