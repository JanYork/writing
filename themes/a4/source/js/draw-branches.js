/**
 * 动态创建画布容器
 * 
 * @returns {HTMLCanvasElement}
 */
function createDrawBranchesCanvasContainer() {
    const old = document.getElementById('draw-branches-canvas-container');
    if (old) {
        old.remove();
    }

    const div = document.createElement('div');
    div.classList.add(
        'fixed',
        'top-0',
        'bottom-0',
        'left-0',
        'right-0',
        'pointer-events-none',
        'print:hidden'
    );
    div.id = 'draw-branches-canvas-container';

    div.style.zIndex = '1';
    div.style.maskImage = 'radial-gradient(circle, transparent, black)';
    div.style.webkitMaskImage = 'radial-gradient(circle, transparent, black)';

    const canvas = document.createElement('canvas');
    canvas.id = 'draw-branches-canvas';
    canvas.width = 400;
    canvas.height = 400;

    div.appendChild(canvas);
    document.body.appendChild(div);

    return canvas;
}

const r180 = Math.PI;
const r90 = Math.PI / 2;
const r15 = Math.PI / 12;
const color = '#88888825';
const { random } = Math;
const MIN_BRANCH = 35;
let len = 6;
let stopped = false;

// 获取窗口大小
let size = {
    width: window.innerWidth,
    height: window.innerHeight,
};

// 监听窗口大小变化
window.addEventListener('resize', () => {
    size.width = window.innerWidth;
    size.height = window.innerHeight;
    
    stopped = true;
    redraw();
});

/**
 * 重绘
 */
function redraw() {
    clearTimeout(redraw.timer);
    redraw.timer = setTimeout(() => {
        draw();
    }, 300);
}

/**
 * 初始化画布
 * 
 * @param {HTMLCanvasElement} canvas
 * @param {number} width 
 * @param {number} height 
 * @param {number} _dpi
 * @returns  {Object} { ctx, dpi }
 */
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

/**
 * 极坐标转换为笛卡尔坐标（直角坐标系
 * 
 * @param {number} x
 * @param {number} y
 * @param {number} r
 * @param {number} theta 弧度
 * @returns  {number[]} [x, y]
 */
function polar2cart(x = 0, y = 0, r = 0, theta = 0) {
    const dx = r * Math.cos(theta);
    const dy = r * Math.sin(theta);
    return [x + dx, y + dy];
}

// 监听dom加载完成事件
document.addEventListener('DOMContentLoaded', () => {
    draw();
});

/**
 * 开始绘制
 */
function draw() {
    const canvas = createDrawBranchesCanvasContainer();
    let { ctx } = initCanvas(canvas, size.width, size.height);
    const width = canvas.width;
    const height = canvas.height;

    let steps = [];
    let prevSteps = [];

    /**
     * 绘制一步(开始)
     * 
     * @param {number} x
     * @param {number} y
     * @param {number} rad 弧度
     * @param {Object} counter 计数器 
     * @returns {void}
     */
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

        // 当前分支数小于最小分支数时，增加分支的几率
        const rate = counter.value <= MIN_BRANCH ? 0.8 : 0.5;

        // 左枝
        if (random() < rate)
            steps.push(() => step(nx, ny, rad1, counter));

        // 右枝
        if (random() < rate)
            steps.push(() => step(nx, ny, rad2, counter));
    }

    // 上一帧的时间
    let lastTime = performance.now();

    // 50fps
    const interval = 1000 / 40;

    let rafId;
    function frameRunner() {
        frame();
        rafId = requestAnimationFrame(frameRunner);
    }

    /**
     * 一帧
     * 
     * @returns {void}
     */
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

    /**
     * 暂停动画
     */
    function pauseRaf() {
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    }

    /**
     * 恢复动画
     */
    function resumeRaf() {
        if (!rafId) {
            rafId = requestAnimationFrame(frameRunner);
        }
    }

    /**
     * 随机数
     * 
     * @returns {void}
     */
    function randomMiddle() {
        return random() * 0.6 + 0.2;
    }

    /**
     * 初始启动
     */
    function start() {
        // 暂停动画
        pauseRaf();

        // 清空画布
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

        // 如果窗口宽度小于 500，只保留两个分支
        if (size.width < 500)
            steps = steps.slice(0, 2);

        // 恢复动画
        resumeRaf();

        // 重置停止状态
        stopped = false;
    }

    // 启动
    start();
}