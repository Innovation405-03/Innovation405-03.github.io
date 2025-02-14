document.addEventListener('DOMContentLoaded', async function () {
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // โหลด Pyodide
    let pyodide = await loadPyodide();
    await pyodide.loadPackage(['numpy', 'scipy']);

    const fileInput = document.getElementById('fileInput');
    const analyzeButton = document.getElementById('analyzeData');
    const saveData = document.getElementById('saveData');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const colorBox = document.getElementById('colorBox');
    const colorValue = document.getElementById('colorValue');
    const nitrateValue = document.getElementById('nitrateValue');

    let pixelArray = []; // เก็บค่าพิกเซลสำหรับวิเคราะห์หลังจากอัปโหลด

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                // วาดภาพลงบน Canvas
                canvas.width = img.width;
                canvas.height = img.height;
                context.drawImage(img, 0, 0, img.width, img.height);

                // ดึงข้อมูลพิกเซล
                const imageData = context.getImageData(0, 0, img.width, img.height);
                pixelArray = Array.from(imageData.data); // เก็บข้อมูลเพื่อใช้กดวิเคราะห์
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });

    analyzeButton.addEventListener('click', async () => {
        if (pixelArray.length === 0) {
            alert("กรุณาอัปโหลดรูปก่อน");
            return;
        }

        const result = await analyzeImage(pixelArray);
        if (result) {
            const color = result.mean_color;
            const nitrateLevel = result.nitrate_level;

            colorBox.style.backgroundColor = color;
            colorValue.textContent = `Color: ${color}`;
            nitrateValue.textContent = `Nitrate Level: ${nitrateLevel}`;

            saveData.addEventListener('click', () => {
                saveResultToLocalStorage(color, nitrateLevel);
            });
        } else {
            console.error("Image analysis failed");
        }
    });

    async function analyzeImage(pixelArray) {
        const pythonCode = `
import numpy as np

def rgb_to_hex(rgb):
    return '#{:02x}{:02x}{:02x}'.format(int(rgb[0]), int(rgb[1]), int(rgb[2]))

def analyze_image(data):
    data = np.array(data, dtype=np.uint8).reshape(-1, 4)[:, :3]  # เอาเฉพาะ RGB
    mean_color = np.mean(data, axis=0)

    # สีมาตรฐาน #CF2D71
    standard_color = np.array([207, 45, 113])

    # เปรียบเทียบความสว่างโดยใช้ค่าเฉลี่ย RGB
    brightness_mean = np.mean(mean_color)
    brightness_standard = np.mean(standard_color)

    if brightness_mean > brightness_standard:
        nitrate_level = "มีสารไนเตรทสูง"
    else:
        nitrate_level = "มีสารไนเตรทตรงตามมาตรฐาน"

    return {'mean_color': rgb_to_hex(mean_color), 'nitrate_level': nitrate_level}

result = analyze_image(${JSON.stringify(pixelArray)})
result
`;

        try {
            let result = await pyodide.runPythonAsync(pythonCode);
            return JSON.parse(result);
        } catch (error) {
            console.error("Error analyzing image:", error);
            return null;
        }
    }

    function saveResultToLocalStorage(color, nitrateLevel) {
        const results = JSON.parse(localStorage.getItem('nitrateResults')) || [];
        const timestamp = new Date().toISOString();
        results.push({ color, nitrateLevel, timestamp });
        localStorage.setItem('nitrateResults', JSON.stringify(results));
    }
});
async function loadJsonData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('ไม่สามารถโหลดไฟล์ JSON ได้');
        
        const jsonData = await response.json();
        console.log('ข้อมูลจากไฟล์ JSON:', jsonData);

        // ถ้าต้องการแสดงผลในหน้า reports.html สามารถเพิ่มโค้ดนี้
        if (document.getElementById('nitrateReports')) {
            const nitrateReports = document.getElementById('nitrateReports');
            nitrateReports.innerHTML = jsonData.map(result => `
                <div class="report">
                    <p>Color: ${result.color}</p>
                    <p>Nitrate Level: ${result.nitrateLevel}</p>
                    <p>Timestamp: ${new Date(result.timestamp).toLocaleString()}</p>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการโหลด JSON:', error);
    }
}

// เรียกใช้งานฟังก์ชันนี้เมื่อหน้า reports.html โหลดเสร็จ
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('reports.html')) {
        loadJsonData();
    }
});
document.addEventListener("DOMContentLoaded", function () {
    fetchData();
    document.getElementById("downloadBtn").addEventListener("click", downloadReport);
});

function fetchData() {
    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            console.log("Data Loaded:", data);
        })
        .catch(error => console.error("Error loading data:", error));
}

function downloadReport() {
    const link = document.createElement("a");
    link.href = "data.json";
    link.download = "report.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
document.addEventListener('DOMContentLoaded', async function () {
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // โหลด Pyodide
    let pyodide = await loadPyodide();
    await pyodide.loadPackage(['numpy', 'scipy']);

    const fileInput = document.getElementById('fileInput');
    const analyzeButton = document.getElementById('analyzeData');
    const saveData = document.getElementById('saveData');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const colorBox = document.getElementById('colorBox');
    const colorValue = document.getElementById('colorValue');
    const nitrateValue = document.getElementById('nitrateValue');

    let pixelArray = []; // เก็บค่าพิกเซลสำหรับวิเคราะห์หลังจากอัปโหลด

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                // วาดภาพลงบน Canvas
                canvas.width = img.width;
                canvas.height = img.height;
                context.drawImage(img, 0, 0, img.width, img.height);

                // ดึงข้อมูลพิกเซล
                const imageData = context.getImageData(0, 0, img.width, img.height);
                pixelArray = Array.from(imageData.data); // เก็บข้อมูลเพื่อใช้กดวิเคราะห์
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });

    analyzeButton.addEventListener('click', async () => {
        if (pixelArray.length === 0) {
            alert("กรุณาอัปโหลดรูปก่อน");
            return;
        }

        const result = await analyzeImage(pixelArray);
        if (result) {
            const color = result.mean_color;
            const nitrateLevel = result.nitrate_level;

            colorBox.style.backgroundColor = color;
            colorValue.textContent = `Color: ${color}`;
            nitrateValue.textContent = `Nitrate Level: ${nitrateLevel}`;

            saveData.addEventListener('click', () => {
                saveResultToJson(color, nitrateLevel);
            });
        } else {
            console.error("Image analysis failed");
        }
    });

    async function analyzeImage(pixelArray) {
        const pythonCode = `
import numpy as np

def rgb_to_hex(rgb):
    return '#{:02x}{:02x}{:02x}'.format(int(rgb[0]), int(rgb[1]), int(rgb[2]))

def analyze_image(data):
    data = np.array(data, dtype=np.uint8).reshape(-1, 4)[:, :3]  # เอาเฉพาะ RGB
    mean_color = np.mean(data, axis=0)

    # สีมาตรฐาน #CF2D71
    standard_color = np.array([207, 45, 113])

    # เปรียบเทียบความสว่างโดยใช้ค่าเฉลี่ย RGB
    brightness_mean = np.mean(mean_color)
    brightness_standard = np.mean(standard_color)

    if brightness_mean > brightness_standard:
        nitrate_level = "มีสารไนเตรทสูง"
    else:
        nitrate_level = "มีสารไนเตรทตรงตามมาตรฐาน"

    return {'mean_color': rgb_to_hex(mean_color), 'nitrate_level': nitrate_level}

result = analyze_image(${JSON.stringify(pixelArray)})
result
`;

        try {
            let result = await pyodide.runPythonAsync(pythonCode);
            return JSON.parse(result);
        } catch (error) {
            console.error("Error analyzing image:", error);
            return null;
        }
    }

    async function saveResultToJson(color, nitrateLevel) {
        try {
            const response = await fetch('data.json');
            const data = await response.json();
            const timestamp = new Date().toISOString();
            data.push({ color, nitrateLevel, timestamp });
    
            // Save data to data.json as a downloadable file
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'data.json';
            link.click();
        } catch (error) {
            console.error("Error saving result:", error);
        }
    }    
});
analyzeButton.addEventListener('click', async () => {
    if (pixelArray.length === 0) {
        alert("กรุณาอัปโหลดรูปก่อน");
        return;
    }

    const result = await analyzeImage(pixelArray);
    if (result) {
        const color = result.mean_color;
        const nitrateLevel = result.nitrate_level;

        colorBox.style.backgroundColor = color;
        colorValue.textContent = `Color: ${color}`;
        nitrateValue.textContent = `Nitrate Level: ${nitrateLevel}`;

        saveData.addEventListener('click', () => {
            saveResultToJson(color, nitrateLevel);
        });
    } else {
        console.error("Image analysis failed");
    }
});

async function analyzeImage(pixelArray) {
    const pythonCode = `
import numpy as np

def rgb_to_hex(rgb):
    return '#{:02x}{:02x}{:02x}'.format(int(rgb[0]), int(rgb[1]), int(rgb[2]))

def analyze_image(data):
    # แปลงข้อมูลพิกเซลเป็น RGB และคำนวณสีเฉลี่ย
    data = np.array(data, dtype=np.uint8).reshape(-1, 4)[:, :3]  # เอาเฉพาะ RGB
    mean_color = np.mean(data, axis=0)

    # สีมาตรฐาน #CF2D71 (สีมาตรฐานสำหรับการตรวจวิเคราะห์)
    standard_color = np.array([207, 45, 113])

    # เปรียบเทียบความสว่างของสี
    brightness_mean = np.mean(mean_color)
    brightness_standard = np.mean(standard_color)

    # หากความสว่างของสีเฉลี่ยสูงกว่ามาตรฐาน
    if brightness_mean > brightness_standard:
        nitrate_level = "มีสารไนเตรทสูง"
    else:
        nitrate_level = "มีสารไนเตรทตรงตามมาตรฐาน"

    return {'mean_color': rgb_to_hex(mean_color), 'nitrate_level': nitrate_level}

result = analyze_image(${JSON.stringify(pixelArray)})
result
`;

    try {
        let result = await pyodide.runPythonAsync(pythonCode);
        return JSON.parse(result);
    } catch (error) {
        console.error("Error analyzing image:", error);
        return null;
    }
}

