(function() {
    const tileWidth  = 2048;
    const tileHeight = 2048;
    const multiplier = 50;
    async function initCanvas(container, tileWidth, tileHeight) {
        const cnv = document.createElement('canvas');
        container.appendChild(cnv);
        cnv.width  = tileWidth;
        cnv.height = tileHeight;
        return cnv;
    }
    async function initDiv(container) {
        const div = document.createElement('div');
        container.appendChild(div);
        div.classList.add('test-container');
        return div;
    }

    async function testWithFunc(func, cont, tileWidth, tileHeight) {
        const cnv  = await initCanvas(cont, tileWidth, tileHeight);
        const ctx  = cnv.getContext('2d');
        const data = ctx.getImageData(0,0,tileWidth,tileHeight);

        for(let x = 0; x < tileWidth; x++) {
            for (let y = 0; y < tileHeight; y++) {
                // Generate the random perlin noise at the x,y point
                // We need to scale it around a bit so that it fits
                // within our output display and has an appropriate
                // look.
                //
                // We also move the value to between 0 and 1
                const val = (func(((x/tileWidth)*multiplier),((y/tileHeight)*multiplier),1)+1)/2;
                const off = y * (tileWidth * 4) + x * 4;
                data.data[off+0] = val*255;
                data.data[off+1] = val*255;
                data.data[off+2] = val*255;
                data.data[off+3] = 255;
            }
        }
        ctx.putImageData(
            data,
            0,
            0
        );
    }

    async function testDefault(tileWidth, tileHeight) {
        const start = performance.now();
        const cont = await initDiv(document.body);
        await testWithFunc(quickNoise.noise, cont, tileWidth, tileHeight);
        const elapsed = performance.now() - start;
        const span = document.createElement('span');
        span.innerText = `quickNoise.noise ${tileWidth} x ${tileHeight}px: Took ${elapsed.toFixed(1)}ms`;
        cont.appendChild(span);
    }


    async function testNonPerlin(tileWidth, tileHeight) {
        const start = performance.now();
        const cont = await initDiv(document.body);
        await testWithFunc(() => (Math.random()*2)-1, cont, tileWidth, tileHeight);
        const elapsed = performance.now() - start;
        const span = document.createElement('span');
        span.innerText = `non perlin, Math.random ${tileWidth} x ${tileHeight}px: Took ${elapsed.toFixed(1)}ms`;
        cont.appendChild(span);
    }

    async function testCreate(tileWidth, tileHeight) {
        const start = performance.now();
        const cont = await initDiv(document.body);
        const perlin = quickNoise.create(Math.random.bind(Math));
        await testWithFunc(perlin, cont, tileWidth, tileHeight);
        const elapsed = performance.now() - start;
        const span = document.createElement('span');
        span.innerText = `quickNoise.create with Math.random\n${tileWidth} x ${tileHeight}px: Took ${elapsed.toFixed(1)}ms`;
        cont.appendChild(span);
    }

    async function testNotShuffled(tileWidth, tileHeight) {
        const start = performance.now();
        const cont = await initDiv(document.body);
        const perlin = quickNoise.create((new Array(256).fill(1).map((a,i)=>i)));
        await testWithFunc(perlin, cont, tileWidth, tileHeight);
        const elapsed = performance.now() - start;
        const span = document.createElement('span');
        span.innerText = `Not Shuffled ${tileWidth} x ${tileHeight}px: Took ${elapsed.toFixed(1)}ms`;
        cont.appendChild(span);
    }

    async function testManyScales() {
        for (let w = 6; w <= 12; w++) {
            await testDefault(Math.pow(2,w), Math.pow(2,w));
        }
    }

    const title = document.createElement('h1');
    const subtitle = document.createElement('h2');

    title.innerText = 'Perlin Noise Library Example';
    subtitle.innerText = `${tileWidth} x ${tileHeight}px`;
    document.body.appendChild(title);
    document.body.appendChild(subtitle);

    testDefault(tileWidth, tileHeight)
        .then(() => testCreate(tileWidth, tileHeight))
        .then(() => testNotShuffled(tileWidth, tileHeight))
        .then(() => testNonPerlin(tileWidth, tileHeight))
        .then(() => {
            const subtitle = document.createElement('h2');
            subtitle.innerText = `Testing many scales`;
            document.body.appendChild(subtitle);
        })
        .then(() => testManyScales())
    ;
})();