function getLunarToday() {
    const lunar = Lunar.fromDate(new Date());
    return `${lunar.getMonth()}-${lunar.getDay()}`;
}

function applyGrayEffect() {
    const graySpecialDates = ['11-13'];
    const lunar = getLunarToday();
    if (graySpecialDates.includes(lunar)) {
        document.body.style.filter = 'grayscale(100%)';
    }
}

applyGrayEffect()
