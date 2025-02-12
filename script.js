document.addEventListener('DOMContentLoaded', function () {
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

    function setLanguage(lang) {
        if (lang === 'th') {
            if (headerText) headerText.textContent = 'ยินดีต้อนรับสู่ AI Color & Nitrate Detector';
            if (welcomeText) welcomeText.textContent = 'ยินดีต้อนรับสู่ระบบตรวจจับสีและไนเตรท AI';
            if (descriptionText) descriptionText.textContent = 'ระบบนี้ออกแบบมาเพื่อช่วยคุณวิเคราะห์สีและตรวจจับระดับไนเตรทในตัวอย่างต่างๆ ระบบนี้ใช้ AI ขั้นสูงเพื่อให้ผลลัพธ์ที่แม่นยำและเชื่อถือได้';
            if (featuresText) featuresText.textContent = 'คุณสมบัติของระบบประกอบด้วย:';
            if (feature1) feature1.textContent = 'การตรวจจับสีแบบเรียลไทม์';
            if (feature2) feature2.textContent = 'การวิเคราะห์ระดับไนเตรท';
            if (feature3) feature3.textContent = 'รายงานที่ครอบคลุม';
            if (feature4) feature4.textContent = 'การตั้งค่าที่ปรับแต่งได้';
            if (nitrateLevelsTitle) nitrateLevelsTitle.textContent = 'ระดับไนเตรทในตัวอย่าง';
            if (nitrateLevelsDetails) nitrateLevelsDetails.textContent = 'รายละเอียดเกี่ยวกับระดับไนเตรทจะแสดงที่นี่';
            if (colorValue) colorValue.textContent = 'สี: N/A';
            if (nitrateValue) nitrateValue.textContent = 'ระดับไนเตรท: N/A';
            if (reportsOverview) reportsOverview.textContent = 'ที่นี่คุณจะพบรายงานที่ครอบคลุมเกี่ยวกับระดับไนเตรทที่ตรวจพบในตัวอย่างต่างๆ ใช้ข้อมูลนี้ในการตัดสินใจและควบคุมคุณภาพ';
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
        function updateData() {
            fetch('fetch_data.php')
                .then(response => response.json())
                .then(data => {
                    document.getElementById('colorValue').innerText = `Color: ${data.color}`;
                    document.getElementById('nitrateValue').innerText = `Nitrate Level: ${data.nitrate}`;
                    document.getElementById('colorBox').style.backgroundColor = data.color;
                })
                .catch(error => console.error('Error fetching data:', error));
        }
        
        setInterval(updateData, 5000);
        updateData();
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
});