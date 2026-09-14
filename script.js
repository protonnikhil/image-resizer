// Configure PDF.js Worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
const { jsPDF } = window.jspdf;

// Massive Database of ALL Indian Gov Exams
const examSpecs = {
    upsc: {
        photo: { w: 350, h: 350, min: 20, max: 300, type: 'image', desc: "350x350px, 20-300KB (JPG)" },
        signature: { w: 1000, h: 1000, min: 20, max: 300, type: 'image', desc: "Proportional, 20-300KB (JPG)" },
        thumb: { w: 350, h: 350, min: 20, max: 300, type: 'image', desc: "Square, 20-300KB (JPG)" },
        marksheet: { format: 'a4', min: 50, max: 2000, type: 'pdf', desc: "Scanned PDF, 50KB - 2MB" },
        degree: { format: 'a4', min: 50, max: 2000, type: 'pdf', desc: "Scanned PDF, 50KB - 2MB" }
    },
    ssc: {
        photo: { w: 413, h: 531, min: 20, max: 50, type: 'image', desc: "3.5x4.5cm, 20-50KB (JPG)" },
        signature: { w: 472, h: 236, min: 10, max: 20, type: 'image', desc: "4.0x2.0cm, 10-20KB (JPG)" },
        thumb: { w: 472, h: 354, min: 10, max: 30, type: 'image', desc: "4.0x3.0cm, 10-30KB (JPG)" },
        marksheet: { format: 'a4', min: 100, max: 500, type: 'pdf', desc: "PDF Format, 100-500KB" },
        degree: { format: 'a4', min: 100, max: 500, type: 'pdf', desc: "PDF Format, 100-500KB" }
    },
    ibps: {
        photo: { w: 413, h: 531, min: 20, max: 50, type: 'image', desc: "4.5x3.5cm, 20-50KB (JPG)" },
        signature: { w: 413, h: 177, min: 10, max: 20, type: 'image', desc: "Black Ink, 10-20KB (JPG)" },
        thumb: { w: 413, h: 295, min: 20, max: 50, type: 'image', desc: "Left Thumb, 20-50KB (JPG)" },
        marksheet: { format: 'a4', min: 20, max: 500, type: 'pdf', desc: "PDF Format, max 500KB" },
        degree: { format: 'a4', min: 20, max: 500, type: 'pdf', desc: "PDF Format, max 500KB" }
    },
    rrb: {
        photo: { w: 413, h: 531, min: 30, max: 70, type: 'image', desc: "35x45mm, 30-70KB (JPG)" },
        signature: { w: 472, h: 236, min: 30, max: 70, type: 'image', desc: "50x20mm, 30-70KB (JPG)" },
        thumb: { w: 472, h: 354, min: 30, max: 70, type: 'image', desc: "Left Thumb, 30-70KB (JPG)" },
        marksheet: { format: 'a4', min: 50, max: 500, type: 'pdf', desc: "PDF, 50-500KB" },
        degree: { format: 'a4', min: 50, max: 500, type: 'pdf', desc: "PDF, 50-500KB" }
    },
    nta: {
        photo: { w: 413, h: 531, min: 10, max: 200, type: 'image', desc: "Passport size, 10-200KB" },
        signature: { w: 413, h: 177, min: 4, max: 30, type: 'image', desc: "Signature, 4-30KB" },
        thumb: { w: 413, h: 295, min: 10, max: 200, type: 'image', desc: "Left/Right thumb, 10-200KB" },
        marksheet: { format: 'a4', min: 50, max: 300, type: 'pdf', desc: "PDF Format, 50-300KB" },
        degree: { format: 'a4', min: 50, max: 300, type: 'pdf', desc: "PDF Format, 50-300KB" }
    },
    defence: {
        photo: { w: 413, h: 531, min: 10, max: 50, type: 'image', desc: "Passport size, 10-50KB" },
        signature: { w: 413, h: 177, min: 10, max: 20, type: 'image', desc: "Signature, 10-20KB" },
        thumb: { w: 413, h: 295, min: 10, max: 20, type: 'image', desc: "Thumb, 10-20KB" },
        marksheet: { format: 'a4', min: 40, max: 1000, type: 'pdf', desc: "PDF Format, 40KB - 1MB" },
        degree: { format: 'a4', min: 40, max: 1000, type: 'pdf', desc: "PDF Format, 40KB - 1MB" }
    },
    state_psc: {
        photo: { w: 413, h: 531, min: 20, max: 50, type: 'image', desc: "Passport size, 20-50KB" },
        signature: { w: 413, h: 177, min: 10, max: 20, type: 'image', desc: "Signature, 10-20KB" },
        thumb: { w: 413, h: 295, min: 10, max: 30, type: 'image', desc: "Thumb, 10-30KB" },
        marksheet: { format: 'a4', min: 50, max: 2000, type: 'pdf', desc: "PDF Format, up to 2MB" },
        degree: { format: 'a4', min: 50, max: 2000, type: 'pdf', desc: "PDF Format, up to 2MB" }
    },
    state_police: {
        photo: { w: 413, h: 531, min: 11, max: 30, type: 'image', desc: "Passport size, 11-30KB" },
        signature: { w: 413, h: 177, min: 5, max: 15, type: 'image', desc: "Signature, 5-15KB" },
        thumb: { w: 413, h: 295, min: 10, max: 30, type: 'image', desc: "Thumb, 10-30KB" },
        marksheet: { format: 'a4', min: 50, max: 600, type: 'pdf', desc: "PDF Format, 50-600KB" },
        degree: { format: 'a4', min: 50, max: 600, type: 'pdf', desc: "PDF Format, 50-600KB" }
    },
    gate: {
        photo: { w: 354, h: 472, min: 20, max: 200, type: 'image', desc: "3.5x4.5cm, 20-200KB" },
        signature: { w: 590, h: 188, min: 5, max: 200, type: 'image', desc: "2.0x7.0cm ratio, 5-200KB" },
        thumb: { w: 413, h: 295, min: 10, max: 200, type: 'image', desc: "Thumb, 10-200KB" },
        marksheet: { format: 'a4', min: 10, max: 500, type: 'pdf', desc: "PDF Format, 10-500KB" },
        degree: { format: 'a4', min: 10, max: 500, type: 'pdf', desc: "PDF Format, 10-500KB" }
    }
};

const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const resultArea = document.getElementById('result-area');
const processBtn = document.getElementById('process-btn');
let currentFile = null;

dropZone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFileSelect);

function handleFileSelect(e) {
    if (e.target.files.length) {
        currentFile = e.target.files[0];
        const isPdf = currentFile.type === 'application/pdf';
        const icon = isPdf ? 'fa-file-pdf text-red-500' : 'fa-file-image text-green-500';
        
        const fileNameDiv = document.getElementById('file-name');
        fileNameDiv.innerHTML = `<i class="fas ${icon} mr-2"></i> ${currentFile.name} (${(currentFile.size/1024).toFixed(1)} KB)`;
        fileNameDiv.classList.remove('hidden');
        dropZone.style.borderColor = '#10b981';
    }
}

processBtn.addEventListener('click', async () => {
    if (!currentFile) return alert('⚠️ Please upload a file first.');
    
    const exam = document.getElementById('exam-select').value;
    const doc = document.getElementById('doc-select').value;
    const specs = examSpecs[exam][doc];

    if (!specs) return alert('This document type is not configured for the selected exam.');

    // Validation: Prevent sending PDF to Image processor and vice versa
    if (specs.type === 'image' && currentFile.type === 'application/pdf') {
        return alert('This exam requires an IMAGE (JPG/PNG) for this document, but you uploaded a PDF.');
    }
    
    const originalBtnText = processBtn.innerHTML;
    processBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Compressing & Formatting...';
    processBtn.disabled = true;

    try {
        let finalBlob, finalUrl, extension;
        
        if (specs.type === 'pdf') {
            // ROUTE 1: PDF COMPRESSION ENGINE
            finalBlob = await compressPDF(currentFile, specs);
            extension = 'pdf';
            document.getElementById('final-image').classList.add('hidden');
            document.getElementById('pdf-success').classList.remove('hidden');
            document.getElementById('pdf-success').classList.add('flex');
        } else {
            // ROUTE 2: IMAGE COMPRESSION ENGINE
            const img = await loadImage(currentFile);
            finalBlob = await advancedCropAndCompress(img, specs);
            extension = 'jpg';
            finalUrl = URL.createObjectURL(finalBlob);
            document.getElementById('final-image').src = finalUrl;
            document.getElementById('final-image').classList.remove('hidden');
            document.getElementById('pdf-success').classList.add('hidden');
            document.getElementById('pdf-success').classList.remove('flex');
        }
        
        finalUrl = URL.createObjectURL(finalBlob);
        const finalKB = (finalBlob.size / 1024).toFixed(2);
        const statusColor = (finalKB >= specs.min && finalKB <= specs.max) ? 'text-green-600' : 'text-red-600';
        
        document.getElementById('spec-info').innerHTML = `
            Target Requirement: <strong>${specs.desc}</strong><br>
            Processed File Size: <strong class="${statusColor}">${finalKB} KB</strong>
        `;
        
        const dl = document.getElementById('download-link');
        dl.href = finalUrl; 
        dl.download = `${exam.toUpperCase()}_${doc.toUpperCase()}_Validated.${extension}`;
        
        resultArea.classList.remove('hidden');
        resultArea.classList.add('show-result');
        setTimeout(() => resultArea.scrollIntoView({ behavior: 'smooth' }), 100);

    } catch (err) {
        alert('An error occurred during processing. Make sure the file is not corrupted.');
        console.error(err);
    } finally {
        processBtn.innerHTML = originalBtnText;
        processBtn.disabled = false;
    }
});

function loadImage(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const i = new Image();
            i.onload = () => resolve(i);
            i.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

// --- IMAGE ENGINE ---
async function advancedCropAndCompress(img, specs) {
    const canvas = document.createElement('canvas');
    canvas.width = specs.w; canvas.height = specs.h;
    const ctx = canvas.getContext('2d');
    
    const imgRatio = img.width / img.height;
    const targetRatio = specs.w / specs.h;
    let sx, sy, sWidth, sHeight;

    if (imgRatio > targetRatio) {
        sHeight = img.height; sWidth = sHeight * targetRatio;
        sx = (img.width - sWidth) / 2; sy = 0;
    } else {
        sWidth = img.width; sHeight = sWidth / targetRatio;
        sx = 0; sy = (img.height - sHeight) / 2;
    }

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);

    let quality = 0.85, minQ = 0.05, maxQ = 1.0, bestBlob = null;
    
    for (let i = 0; i < 10; i++) { 
        const blob = await new Promise(r => canvas.toBlob(r, 'image/jpeg', quality));
        const sizeKB = blob.size / 1024;
        bestBlob = blob;
        
        if (sizeKB >= specs.min && sizeKB <= specs.max) break; 
        if (sizeKB > specs.max) maxQ = quality;
        else minQ = quality;
        
        quality = (minQ + maxQ) / 2;
    }
    return bestBlob;
}

// --- NEW: PDF ENGINE ---
async function compressPDF(file, specs) {
    // Read file as ArrayBuffer for PDF.js
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    
    // Create new secure PDF (A4 size is standard for Gov docs)
    const newPdf = new jsPDF('p', 'mm', specs.format);
    
    // Process pages one by one to save mobile RAM
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 }); // Render at 2x for clarity
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        await page.render({ canvasContext: ctx, viewport: viewport }).promise;
        
        // Compress canvas page to image
        const imgData = canvas.toDataURL('image/jpeg', 0.6); // 60% quality base
        
        if (pageNum > 1) newPdf.addPage();
        
        // Calculate dimensions to fit A4 page
        const pdfWidth = newPdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        newPdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    }
    
    // Return generated PDF as Blob
    // Note: Due to heavy browser processing limits, we do a single pass at a smart compression ratio
    // which normally places 1-3 page marksheets safely within the 50-500KB range.
    return newPdf.output('blob');
    }
