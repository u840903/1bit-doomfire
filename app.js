// Workaround until top-level await is a thing.
(async function () {

    const _WIND = 1.25;
    const _DECAY = 1.25;
    const _WIDTH = 110
    const _HEIGHT = 55

    // Load sprite with gradients.
    const sprite = await new Promise(resolve => {
        const image = document.createElement('img');
        image.onload = () => resolve(image);
        image.src = 'sprite.png';
    })

    // We can get the tile size by getting the sprite height,
    // since all tiles are on the horizontal plane.
    const tileSize = sprite.height;
    const colors = Math.floor(sprite.width / sprite.height);

    // Create canvas.
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = _WIDTH * tileSize;
    canvas.height = _HEIGHT * tileSize;
    document.body.appendChild(canvas);

    // Build fire.
    const fire = Array(_WIDTH * _HEIGHT).fill(0);
    for (let i = fire.length - _WIDTH; i < fire.length; i++) {
        fire[i] = colors - 1;
    }

    function drawTile(i, x, y) {
        const sy = i * tileSize;
        context.drawImage(sprite, sy, 0, tileSize, tileSize, x, y, tileSize, tileSize);
    }

    function tick() {

        // Update all tiles.
        updateTiles();

        // Render all tiles.
        render();

        // Repeat.
        requestAnimationFrame(tick);
    }

    function updateTiles() {
        for (let i = 0; i <= fire.length - _WIDTH; i++) {
            updateTile(i)
        }
    }

    function updateTile(current) {

        // Base next value on the tile just below.
        const previous = current + _WIDTH;

        const previousIntensity = fire[previous];

        const wind = Math.floor(Math.random() * _WIND)
        const decay = Math.floor(Math.random() * _DECAY);
        const intensity = Math.max(previousIntensity - decay, 0);

        // Update tile and adjust for wind.
        fire[current - wind] = intensity
    }

    function render() {
        for (let i = 0; i <= fire.length; i++) {
            const intensity = fire[i];
            const x = (i % _WIDTH) * tileSize;
            const y = Math.floor(i / _WIDTH) * tileSize;
            drawTile(intensity, x, y)
        }
    }

    tick();

}());
