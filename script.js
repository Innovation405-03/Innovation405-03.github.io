document.addEventListener('DOMContentLoaded', async function () {
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    const languageToggle = document.getElementById('languageToggle');
    const headerText = document.getElementById('headerText');
    const nitrateLevelsTitle = document.getElementById('nitrateLevelsTitle');
    const nitrateLevelsDetails = document.getElementById('nitrateLevelsDetails');
    const colorValue = document.getElementById('colorValue');
    const nitrateValue = document.getElementById('nitrateValue');
    const reportsOverview = document.getElementById('reportsOverview');
    const reportsTitle = document.getElementById('reportsTitle');
    const welcomeText = document.getElementById('welcomeText');
    const descriptionText = document.getElementById('descriptionText');
    const featuresText = document.getElementById('featuresText');
    const feature1 = document.getElementById('feature1');
    const feature2 = document.getElementById('feature2');
    const feature3 = document.getElementById('feature3');
    const feature4 = document.getElementById('feature4');
    const nitrateReports = document.getElementById('nitrateReports');

    function setLanguage(lang) {
        if (lang === 'th') {
            if (headerText) headerText.textContent = 'ยินดีต้อนรับสู่ AI Color & Nitrate Detector';
            if (welcomeText) welcomeText.textContent = 'ยินดีต้อนรับสู่ระบบตรวจจับสีและไนเตรท AI';
            if (descriptionText) descriptionText.textContent = 'ระบบนี้ออกแบบมาเพื่อช่วยคุณวิเคราะห์สีและตรวจสอบระดับไนเตรทในตัวอย่างต่าง ๆ โดยใช้เทคโนโลยี AI ขั้นสูง';
            if (featuresText) featuresText.textContent = 'คุณสมบัติของระบบประกอบด้วย:';
            if (feature1) feature1.textContent = 'การตรวจจับสีแบบเรียลไทม์';
            if (feature2) feature2.textContent = 'การวิเคราะห์ระดับไนเตรท';
            if (feature3) feature3.textContent = 'รายงานที่ครอบคลุม';
            if (feature4) feature4.textContent = 'การตั้งค่าที่ปรับแต่งได้';
            if (nitrateLevelsTitle) nitrateLevelsTitle.textContent = 'ระดับไนเตรทในตัวอย่าง';
            if (nitrateLevelsDetails) nitrateLevelsDetails.textContent = 'รายละเอียดเกี่ยวกับระดับไนเตรทจะแสดงที่นี่';
            if (colorValue) colorValue.textContent = 'สี: N/A';
            if (nitrateValue) nitrateValue.textContent = 'ระดับไนเตรท: N/A';
            if (reportsOverview) reportsOverview.textContent = 'ที่นี่คุณจะพบรายงานที่ครอบคลุมเกี่ยวกับระดับไนเตรทที่ตรวจพบในตัวอย่างต่าง ๆ ใช้ข้อมูลนี้เพื่อการตัดสินใจที่มีข้อมูลและการควบคุมคุณภาพ';
            if (reportsTitle) reportsTitle.textContent = 'รายงานระดับไนเตรท';
            languageToggle.textContent = 'English';
            localStorage.setItem('language', 'th');
        } else {
            if (headerText) headerText.textContent = 'Welcome to the AI Color & Nitrate Detector';
            if (welcomeText) welcomeText.textContent = 'Welcome to the AI Color & Nitrate Detection System';
            if (descriptionText) descriptionText.textContent = 'This system is designed to help you analyze colors and detect nitrate levels in various samples. It uses advanced AI algorithms to provide accurate and reliable results.';
            if (featuresText) featuresText.textContent = 'Features include:';
            if (feature1) feature1.textContent = 'Real-time color detection';
            if (feature2) feature2.textContent = 'Nitrate level analysis';
            if (feature3) feature3.textContent = 'Comprehensive reports';
            if (feature4) feature4.textContent = 'Customizable settings';
            if (nitrateLevelsTitle) nitrateLevelsTitle.textContent = 'Nitrate Levels in Samples';
            if (nitrateLevelsDetails) nitrateLevelsDetails.textContent = 'Details about the nitrate levels will be displayed here.';
            if (colorValue) colorValue.textContent = 'Color: N/A';
            if (nitrateValue) nitrateValue.textContent = 'Nitrate Level: N/A';
            if (reportsOverview) reportsOverview.textContent = 'Here you will find comprehensive reports on nitrate levels detected in various samples. Use this information to make informed decisions and ensure quality control.';
            if (reportsTitle) reportsTitle.textContent = 'Reports on Nitrate Levels';
            languageToggle.textContent = 'ภาษาไทย';
            localStorage.setItem('language', 'en');
        }
    }

    languageToggle.addEventListener('click', () => {
        const currentLanguage = localStorage.getItem('language') || 'en';
        setLanguage(currentLanguage === 'en' ? 'th' : 'en');
    });

    // Set the initial language based on local storage
    const initialLanguage = localStorage.getItem('language') || 'en';
    setLanguage(initialLanguage);

    if (document.querySelector('.navbar ul')) {
        function toggleMenu() {
            const navbarUl = document.querySelector('.navbar ul');
            navbarUl.classList.toggle('active');
        }
        document.querySelector('.hamburger').addEventListener('click', toggleMenu);
    }

    // Specific to analysis.html
    if (document.getElementById('fileInput')) {
        const fileInput = document.getElementById('fileInput');
        const canvas = document.getElementById('canvas');
        const context = canvas.getContext('2d');
        const colorBox = document.getElementById('colorBox');
        const colorValue = document.getElementById('colorValue');
        const nitrateValue = document.getElementById('nitrateValue');
        const saveData = document.getElementById('saveData');

        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = new Image();
                    img.onload = () => {
                        canvas.width = img.width;
                        canvas.height = img.height;
                        context.drawImage(img, 0, 0, img.width, img.height);
                        const imageData = context.getImageData(0, 0, img.width, img.height);

                        // Run Python code using Pyodide to analyze the image
                        analyzeImage(imageData).then(result => {
                            const color = result.mean_color;
                            const nitrateLevel = result.nitrate_level;

                            colorBox.style.backgroundColor = color;
                            colorValue.textContent = `Color: ${color}`;
                            nitrateValue.textContent = `Nitrate Level: ${nitrateLevel}`;

                            saveData.addEventListener('click', () => {
                                saveResultToLocalStorage(color, nitrateLevel);
                            });
                        });
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });

        function saveResultToLocalStorage(color, nitrateLevel) {
            const results = JSON.parse(localStorage.getItem('nitrateResults')) || [];
            const timestamp = new Date().toISOString();
            results.push({ color, nitrateLevel, timestamp });
            localStorage.setItem('nitrateResults', JSON.stringify(results));
        }

        async function analyzeImage(imageData) {
            // Python code to analyze the image
            const pythonCode = `
import numpy as np
from scipy.spatial import KDTree

def rgb_to_hex(rgb):
    return '#{:02x}{:02x}{:02x}'.format(int(rgb[0]), int(rgb[1]), int(rgb[2]))

# Define beetroot color and threshold for nitrate levels
beetroot_color = np.array([138, 43, 226])
thresholds = {
    'High': np.array([255, 165, 0]),
    'Medium': [np.array([255, 192, 203]), np.array([255, 255, 0])]
}

# Convert image data to numpy array
data = np.frombuffer(imageData.data, dtype=np.uint8)
data = data.reshape(-1, 4)[:, :3]  # Remove alpha channel if present

# Find the mean color of the image
mean_color = np.mean(data, axis=0)

# Compare mean color with beetroot and thresholds
tree = KDTree([beetroot_color] + thresholds['High'].tolist() + thresholds['Medium'][0].tolist() + thresholds['Medium'][1].tolist())
dist, index = tree.query(mean_color)

# Determine nitrate level based on color distance
if np.array_equal(tree.data[index], thresholds['High']):
    nitrate_level = 'High'
elif np.array_equal(tree.data[index], thresholds['Medium'][0]) or np.array_equal(tree.data[index], thresholds['Medium'][1]):
    nitrate_level = 'Medium'
else:
    nitrate_level = 'None'

{
    'mean_color': rgb_to_hex(mean_color),
    'nitrate_level': nitrate_level
}
`;
            let result = await pyodide.runPythonAsync(pythonCode, { imageData: imageData });
            return result;
        }
    }

    // Specific to reports.html
    if (document.getElementById('nitrateReports')) {
        const nitrateReports = document.getElementById('nitrateReports');

        function updateReports() {
            const results = JSON.parse(localStorage.getItem('nitrateResults')) || [];
            nitrateReports.innerHTML = results.map(result => `
                <div class="report">
                    <p>Color: ${result.color}</p>
                    <p>Nitrate Level: ${result.nitrateLevel}</p>
                    <p>Timestamp: ${new Date(result.timestamp).toLocaleString()}</p>
                </div>
            `).join('');
        }

        setInterval(updateReports, 5000);
        updateReports();
    }

    // Specific to camera.html
    if (document.getElementById('video')) {
        const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const photo = document.getElementById('photo');
        const captureButton = document.getElementById('capture');

        // Access the user's camera
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                video.srcObject = stream;
            })
            .catch(error => {
                console.error("Error accessing camera: ", error);
            });

        // Capture the image
        captureButton.addEventListener('click', () => {
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert to image and display
            const imageData = canvas.toDataURL('image/png');
            photo.src = imageData;
            photo.style.display = 'block';
        });
    }

    // Load Pyodide and initialize Python environment
    let pyodide = await loadPyodide();
    await pyodide.loadPackage(['numpy', 'scipy']);
});