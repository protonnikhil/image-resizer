// Database of Exam Specifications (Width, Height, MinKB, MaxKB)
const examSpecs = {
    upsc: {
        photo: { w: 350, h: 350, min: 20, max: 300, desc: "350x350px, 20-300KB" },
        signature: { w: 1000, h: 1000, min: 20, max: 300, desc: "350x350px, 20-300KB" }, // UPSC auto-scales sigs in square ratio
        thumb: { w: 350, h: 350, min: 20, max: 300, desc: "Square aspect, 20-300KB" }
    },
    ssc: {
        photo: { w: 413, h: 531, min: 20, max: 50, desc: "3.5cm x 4.5cm, 20-50KB" },
        signature: { w: 472, h: 236, min: 10, max: 20, desc: "4.0cm x 2.0cm, 10-20KB" },
        thumb: { w: 472, h: 354, min: 10, max: 30, desc: "4.0cm x 3.0cm, 10-30KB" }
    },
    neet: {
        photo: { w: 413, h: 531, min: 10, max: 200, desc: "Passport size, 10-200KB" },
        signature: { w: 413, h: 177, min: 4, max: 30, desc: "Signature, 4-30KB" },
        thumb: { w: 413, h: 295, min: 10, max: 200, desc: "Left/Right thumb, 10-200KB" }
    },
    jee: {
        photo: { w: 413, h: 531, min: 10, max: 200, desc: "Passport size, 10-200KB" },
        signature: { w: 413, h: 177, min: 4, max: 30, desc: "Signature, 4-30KB" },
        thumb: { w: 413, h: 295, min: 10, max: 50, desc: "Thumb impression, 10-50KB" }
    },
    cuet: {
        photo: { w: 413, h: 531, min: 10, max: 200, desc: "Passport size, 10-200KB" },
        signature: { w: 413, h: 177, min: 4, max: 30, desc: "Signature, 4-30KB" },
        thumb: { w: 413, h: 295, min: 10, max: 50, desc: "Thumb, 10-50KB" }
    },
    state_police: {
        photo: { w: 413, h: 531, min: 11, max: 30, desc: "Passport size, 11-30KB" },
        signature: { w: 413, h: 177, min: 5, max: 15, desc: "Signature, 5-15KB" },
        thumb: { w: 413, h: 295, min: 10, max: 30, desc: "Thumb, 10-30KB" }
    }
};

const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const resultArea = document.getElementById('result-area');
const processBtn = document.getElementById('process-btn');
let currentFile = null;

// UI Interactions for Drag/Drop
dropZone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFileSelect);

function handleFileSelect(e) {
    if (e.target.files.length) {
        currentFile = e.target.files[0];
        const fileNameDiv = document.getElementById('file-name');
        fileNameDiv.innerHTML = `<i class="fas fa-file-image mr-2"></i> ${currentFile.name} (${(currentFile.size/1024).toFixed(1)} KB)`;
        fileNameDiv.classList.remove('hidden');
        dropZone.style.borderColor = '#10b981'; // Green border on success
    }
}

// Processing Core Logic
processBtn.addEventListener('click', async () => {
    if (!currentFile) return alert('⚠️ Please upload an image first.');
    
    const exam = document.getElementById('exam-select').value;
    const doc = document.getElementById('doc-select').value;
    const specs = examSpecs[exam][doc];

    if(!specs) return alert('This specific document type is not required for this exam.');

    // UI Loading State
    const originalBtnText = processBtn.innerHTML;
    processBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Processing Algorithms...';
    processBtn.disabled = true;

    try {
        const img = await loadImage(currentFile);
        const processedBlob = await advancedCropAndCompress(img, specs);
        
        // Render Output
        const finalUrl = URL.createObjectURL(processedBlob);
        document.getElementById('final-image').src = finalUrl;
        
        const finalKB = (processedBlob.size / 1024).toFixed(2);
        const statusColor = (finalKB >= specs.min && finalKB <= specs.max) ? 'text-green-600' : 'text-red-600';
        
        document.getElementById('spec-info').innerHTML = `
            Target: <strong>${specs.desc}</strong><br>
            Final Output: <strong class="${statusColor}">${finalKB} KB</strong><br>
            Dimensions: <strong>${specs.w} x ${specs.h} pixels</strong>
        `;
        
        const dl = document.getElementById('download-link');
        dl.href = finalUrl; 
        dl.download = `${exam.toUpperCase()}_${doc}_Formatted.jpg`;
        
        resultArea.classList.remove('hidden');
        resultArea.classList.add('show-result');
        setTimeout(() => resultArea.scrollIntoView({ behavior: 'smooth' }), 100);

    } catch (err) {
        alert('An error occurred during processing.');
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

async function advancedCropAndCompress(img, specs) {
    const canvas = document.createElement('canvas');
    canvas.width = specs.w; 
    canvas.height = specs.h;
    const ctx = canvas.getContext('2d');
    
    // Smart Center Crop Algorithm
    const imgRatio = img.width / img.height;
    const targetRatio = specs.w / specs.h;
    let sx, sy, sWidth, sHeight;

    if (imgRatio > targetRatio) {
        sHeight = img.height; 
        sWidth = sHeight * targetRatio;
        sx = (img.width - sWidth) / 2; 
        sy = 0;
    } else {
        sWidth = img.width; 
        sHeight = sWidth / targetRatio;
        sx = 0; 
        sy = (img.height - sHeight) / 2;
    }

    // White background to handle transparent PNGs
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Smooth image rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);

    // Iterative Compression Engine to hit strict Gov KB requirements
    let quality = 0.90, minQ = 0.05, maxQ = 1.0, bestBlob = null;
    
    for (let i = 0; i < 12; i++) { // Higher iterations for precision
        const blob = await new Promise(r => canvas.toBlob(r, 'image/jpeg', quality));
        const sizeKB = blob.size / 1024;
        bestBlob = blob;
        
        if (sizeKB >= specs.min && sizeKB <= specs.max) {
            // Favor slightly larger files within range for better quality
            if (sizeKB > (specs.max - 2) && quality > minQ) {
                maxQ = quality;
                quality = (minQ + maxQ) / 2;
                continue;
            }
            break; 
        }
        
        if (sizeKB > specs.max) maxQ = quality;
        else minQ = quality;
        
        quality = (minQ + maxQ) / 2;
    }
    return bestBlob;
}

