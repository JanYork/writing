const graySpecialDates = ['12-13'];

function getToday() {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${month}-${day}`;
}

function applyGrayEffect() {
    const todayDate = getToday();

    if (graySpecialDates.includes(todayDate)) {
        document.body.style.filter = 'grayscale(100%)';
    }
}

applyGrayEffect();
