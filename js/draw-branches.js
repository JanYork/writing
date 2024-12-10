// 函数：动态创建 DOM 元素
function createDynamicCanvasContainer() {
    // 创建 <div> 元素
    const div = document.createElement('div');

    // 添加类名
    div.classList.add(
        'fixed',
        'top-0',
        'bottom-0',
        'left-0',
        'right-0',
        'pointer-events-none',
        'print:hidden'
    );

    // 设置内联样式
    div.style.zIndex = '1';
    div.style.maskImage = 'radial-gradient(circle, transparent, black)';
    div.style.webkitMaskImage = 'radial-gradient(circle, transparent, black)';

    // 创建 <canvas> 元素
    const canvas = document.createElement('canvas');
    canvas.id = 'myCanvas';
    canvas.width = 400;
    canvas.height = 400;

    // 将 <canvas> 添加到 <div> 中
    div.appendChild(canvas);

    // 将 <div> 添加到 <body> 中
    document.body.appendChild(div);

    return canvas; // 返回 canvas 元素以便后续操作
}
// 原代码中的常量与变量定义
const r180 = Math.PI;
const r90 = Math.PI / 2;
const r15 = Math.PI / 12;
const color = '#88888825';
const { random } = Math;
const MIN_BRANCH = 30;
let len = 6;
let stopped = false;

// 模拟原本的 size = reactive(useWindowSize())
// 这里使用 window.innerWidth 和 window.innerHeight 来动态获取窗口大小
let size = {
    width: window.innerWidth,
    height: window.innerHeight,
};

window.addEventListener('resize', () => {
    size.width = window.innerWidth;
    size.height = window.innerHeight;
});

// 原代码中的函数
function initCanvas(canvas, width = 400, height = 400, _dpi) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const bsr = ctx.webkitBackingStorePixelRatio
        || ctx.mozBackingStorePixelRatio
        || ctx.msBackingStorePixelRatio
        || ctx.oBackingStorePixelRatio
        || ctx.backingStorePixelRatio
        || 1;

    const dpi = _dpi || dpr / bsr;

    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    canvas.width = dpi * width;
    canvas.height = dpi * height;
    ctx.scale(dpi, dpi);

    return { ctx, dpi };
}

function polar2cart(x = 0, y = 0, r = 0, theta = 0) {
    const dx = r * Math.cos(theta);
    const dy = r * Math.sin(theta);
    return [x + dx, y + dy];
}

// 用于替代 onMounted 的逻辑
document.addEventListener('DOMContentLoaded', () => {
    const canvas = createDynamicCanvasContainer();
    let { ctx } = initCanvas(canvas, size.width, size.height);
    const width = canvas.width;
    const height = canvas.height;

    let steps = [];
    let prevSteps = [];

    function step(x, y, rad, counter = { value: 0 }) {
        const length = random() * len;
        counter.value += 1;

        const [nx, ny] = polar2cart(x, y, length, rad);

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(nx, ny);
        ctx.stroke();

        const rad1 = rad + random() * r15;
        const rad2 = rad - random() * r15;

        // 超出范围不继续
        if (nx < -100 || nx > size.width + 100 || ny < -100 || ny > size.height + 100)
            return;

        const rate = counter.value <= MIN_BRANCH ? 0.8 : 0.5;

        // 左枝
        if (random() < rate)
            steps.push(() => step(nx, ny, rad1, counter));

        // 右枝
        if (random() < rate)
            steps.push(() => step(nx, ny, rad2, counter));
    }

    let lastTime = performance.now();
    const interval = 1000 / 40; // 50fps

    let rafId;
    function frameRunner() {
        frame();
        rafId = requestAnimationFrame(frameRunner);
    }

    function frame() {
        if (performance.now() - lastTime < interval)
            return;

        prevSteps = steps;
        steps = [];
        lastTime = performance.now();

        if (!prevSteps.length) {
            pauseRaf();
            stopped = true;
        }

        // 执行上帧的所有 step
        prevSteps.forEach((i) => {
            // 50% 的几率保持不执行，以产生更有机的效果
            if (random() < 0.5)
                steps.push(i);
            else
                i();
        });
    }

    function pauseRaf() {
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    }

    function resumeRaf() {
        if (!rafId) {
            rafId = requestAnimationFrame(frameRunner);
        }
    }

    function randomMiddle() {
        return random() * 0.6 + 0.2;
    }

    function start() {
        pauseRaf();
        ctx.clearRect(0, 0, width, height);
        ctx.lineWidth = 1;
        ctx.strokeStyle = color;
        prevSteps = [];
        steps = [
            () => step(randomMiddle() * size.width, -5, r90),
            () => step(randomMiddle() * size.width, size.height + 5, -r90),
            () => step(-5, randomMiddle() * size.height, 0),
            () => step(size.width + 5, randomMiddle() * size.height, r180),
        ];
        if (size.width < 500)
            steps = steps.slice(0, 2);
        resumeRaf();
        stopped = false;
    }

    // 初始启动
    start();
});