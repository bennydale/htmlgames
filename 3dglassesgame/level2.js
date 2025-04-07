// level2.js

window.level2 = (function() {
  // Level 2 variables
  let treesPhase2 = [];
  let lastTreeSpawnTime = 0;
  let enemiesPhase2 = [];
  let lastEnemy2SpawnTime = 0;
  const enemy2SpawnInterval = 2000; // enemy spawn interval (ms)
  const enemySpawnDelay = 3000;     // delay before enemy spawns (ms)
  let enemyPhase2SpawnStartTime = 0;
  let level2StartTime = 0;  // Time when level 2 begins (for top mountain animation)
  
  // Top mountain points (jagged shape)
  let topMountainPoints = [];
  
  // Initialize level 2 (reset trees, enemies, etc.)
  function init() {
    treesPhase2 = [];
    lastTreeSpawnTime = performance.now();
    enemiesPhase2 = [];
    enemyPhase2SpawnStartTime = performance.now() + enemySpawnDelay;
    level2StartTime = performance.now();
    
    // Generate a jagged mountain range for the top mountains.
    topMountainPoints = [];
    const numPoints = 10; // more points for a jagged look
    for (let i = 0; i < numPoints; i++) {
      let x = (i / (numPoints - 1)) * width;
      // y varies randomly between 20 and 60 pixels.
      let y = 20 + Math.random() * 40;
      topMountainPoints.push({ x, y });
    }
  }
  
  // Update and draw all Level 2 elements
  function updateAndDraw(deltaTime, timestamp) {
    // ---------- Top Mountains ----------
    // Compute vertical offset that increases over time but stops after a limited descent.
    let topMountainOffset = (timestamp - level2StartTime) * 0.1; // adjust speed as desired
    drawTopMountains(topMountainOffset);
    
    // ---------- Regular Mountain Range (from previous design) ----------
    const mountainTransitionDuration = 5000;
    let mountainT = Math.min((timestamp - phase1StartTime - phase1Duration) / mountainTransitionDuration, 1);
    let mountainY = -300 + (150 + 300) * mountainT;
    const maxMountainDisparity = 5;
    let dynamicMountainDisparity = maxMountainDisparity * Math.cos(Math.PI * mountainT);
    drawMountains(mountainY, dynamicMountainDisparity);
    
    // ---------- Trees ----------
    updateTrees(deltaTime);
    treesPhase2.forEach(function(tree) {
      drawTree(tree);
    });
    
    // ---------- Enemies ----------
    if (performance.now() > enemyPhase2SpawnStartTime && performance.now() - lastEnemy2SpawnTime > enemy2SpawnInterval) {
      enemiesPhase2.push({
         x: Math.random() * width,
         y: -50,
         speed: 0.3 + Math.random() * 0.5,
         scale: 0.5
      });
      lastEnemy2SpawnTime = performance.now();
    }
    for (let i = enemiesPhase2.length - 1; i >= 0; i--) {
      let enemy = enemiesPhase2[i];
      enemy.y += enemy.speed * deltaTime;
      enemy.scale += 0.001 * deltaTime; // gradual enemy growth
      drawEnemy(enemy);
      const currentEnemyRadius = 20 * enemy.scale;
      if (enemy.y - currentEnemyRadius > height) {
        enemiesPhase2.splice(i, 1);
        lives--;
        livesDisplay.textContent = `Lives: ${lives}`;
        if (lives <= 0) {
          gameOver = true;
          statusDisplay.textContent = "GAME OVER";
        }
      }
    }
  }
  
  // Draw the regular mountain range (unchanged from before)
  function drawMountains(mountainY, disparityOffset) {
    const mountainPoints = [
      { x: 0, y: 0 },
      { x: width * 0.3, y: -50 },
      { x: width * 0.6, y: 20 },
      { x: width * 0.8, y: -30 },
      { x: width, y: 0 }
    ];
    ctx.lineWidth = 1;
    ctx.globalCompositeOperation = 'screen';
    // Red layer.
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(mountainPoints[0].x, mountainPoints[0].y + mountainY);
    mountainPoints.forEach(pt => ctx.lineTo(pt.x, pt.y + mountainY));
    ctx.stroke();
    // Blue layer.
    ctx.strokeStyle = 'cyan';
    ctx.beginPath();
    ctx.moveTo(mountainPoints[0].x + disparityOffset, mountainPoints[0].y + mountainY);
    mountainPoints.forEach(pt => ctx.lineTo(pt.x + disparityOffset, pt.y + mountainY));
    ctx.stroke();
  }
  
  // Draw top mountains that descend from the top with increased anaglyph disparity and a jagged shape.
  function drawTopMountains(topOffset) {
    // Clamp the topOffset so it never exceeds 1/8 of the screen height.
    let actualOffset = Math.min(topOffset, height / 8);
    const disparity = 100; // increased disparity for far-apart red and blue layers
    const redOffset = -disparity;
    const blueOffset = disparity;
    ctx.lineWidth = 1;
    ctx.globalCompositeOperation = 'screen';
    // Red layer.
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(topMountainPoints[0].x, topMountainPoints[0].y + actualOffset);
    topMountainPoints.forEach(pt => ctx.lineTo(pt.x, pt.y + actualOffset));
    ctx.stroke();
    // Blue layer.
    ctx.strokeStyle = 'cyan';
    ctx.beginPath();
    ctx.moveTo(topMountainPoints[0].x + blueOffset, topMountainPoints[0].y + actualOffset);
    topMountainPoints.forEach(pt => ctx.lineTo(pt.x + blueOffset, pt.y + actualOffset));
    ctx.stroke();
  }
  
  // Update tree positions and spawn new trees (trees now spawn more frequently)
  function updateTrees(deltaTime) {
    // Spawn trees every 250ms
    if (performance.now() - lastTreeSpawnTime > 250) {
      treesPhase2.push({
        x: Math.random() * width,
        y: -50,
        scale: 0.5  // initial scale remains modest
      });
      lastTreeSpawnTime = performance.now();
    }
    // Update each tree’s position and growth (slower growth to keep trees small)
    for (let i = treesPhase2.length - 1; i >= 0; i--) {
      let tree = treesPhase2[i];
      tree.y += 0.5 * deltaTime;
      tree.scale += 0.003 * deltaTime; // slower growth rate
      if (tree.y - 50 * tree.scale > height) {
        treesPhase2.splice(i, 1);
      }
    }
  }
  
  // Draw a tree with dynamic disparity.
  function drawTree(tree) {
    const maxTreeDisparity = 10;
    let progress = (tree.y + 50) / (height + 100);
    progress = Math.min(Math.max(progress, 0), 1);
    let dynamicTreeDisparity = maxTreeDisparity * Math.cos(Math.PI * progress);
    let redOffset = -dynamicTreeDisparity;
    let blueOffset = dynamicTreeDisparity;
    const treeShape = [
      { x: -10, y: 0 },
      { x: 0, y: -30 },
      { x: 10, y: 0 }
    ];
    ctx.lineWidth = 2;
    ctx.globalCompositeOperation = 'screen';
    // Red layer.
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(tree.x + redOffset + treeShape[0].x * tree.scale, tree.y + treeShape[0].y * tree.scale);
    treeShape.forEach(pt => ctx.lineTo(tree.x + redOffset + pt.x * tree.scale, tree.y + pt.y * tree.scale));
    ctx.closePath();
    ctx.stroke();
    // Blue layer.
    ctx.strokeStyle = 'cyan';
    ctx.beginPath();
    ctx.moveTo(tree.x + blueOffset + treeShape[0].x * tree.scale, tree.y + treeShape[0].y * tree.scale);
    treeShape.forEach(pt => ctx.lineTo(tree.x + blueOffset + pt.x * tree.scale, tree.y + pt.y * tree.scale));
    ctx.closePath();
    ctx.stroke();
  }
  
  // Draw an enemy (a circle with anaglyph offset).
  function drawEnemy(enemy) {
    const baseRadius = 20;
    const enemyRadius = baseRadius * enemy.scale;
    const enemyProgress = (enemy.y + 50) / (height + 100);
    const maxEnemyDisparity = 10;
    const dynamicEnemyDisparity = maxEnemyDisparity * Math.cos(Math.PI * enemyProgress);
    const redOffset = -dynamicEnemyDisparity;
    const blueOffset = dynamicEnemyDisparity;
    
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(enemy.x + redOffset, enemy.y, enemyRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'cyan';
    ctx.beginPath();
    ctx.arc(enemy.x + blueOffset, enemy.y, enemyRadius, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Handle click events for Level 2 (checks if a circle enemy was shot)
  function handleClick(mouseX, mouseY) {
    for (let i = enemiesPhase2.length - 1; i >= 0; i--) {
      let enemy = enemiesPhase2[i];
      const enemyRadius = 20 * enemy.scale;
      const enemyProgress = (enemy.y + 50) / (height + 100);
      const maxEnemyDisparity = 10;
      const dynamicEnemyDisparity = maxEnemyDisparity * Math.cos(Math.PI * enemyProgress);
      const redOffset = -dynamicEnemyDisparity;
      const blueOffset = dynamicEnemyDisparity;
      
      // Check the red-shifted circle.
      const dxRed = mouseX - (enemy.x + redOffset);
      const dyRed = mouseY - enemy.y;
      // Check the blue-shifted circle.
      const dxBlue = mouseX - (enemy.x + blueOffset);
      const dyBlue = mouseY - enemy.y;
      
      if (Math.sqrt(dxRed * dxRed + dyRed * dyRed) < enemyRadius ||
          Math.sqrt(dxBlue * dxBlue + dyBlue * dyBlue) < enemyRadius) {
        enemiesPhase2.splice(i, 1);
        score++;
        break;
      }
    }
  }
  
  return {
    init: init,
    updateAndDraw: updateAndDraw,
    handleClick: handleClick
  };
})();
