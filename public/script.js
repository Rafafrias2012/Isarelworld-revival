const socket = io();

    socket.on('initialPosition', (position) => {
      updateBonziPosition(position);
    });

    socket.on('updateBonzi', (position) => {
      updateBonziPosition(position);
    });

    const bonzi = document.getElementById('bonzi');

    function updateBonziPosition(position) {
      bonzi.style.left = position.x + 'px';
      bonzi.style.top = position.y + 'px';
    }

    bonzi.addEventListener('mousedown', startDrag);
    document.addEventListener('mouseup', endDrag);

    function startDrag(event) {
      document.addEventListener('mousemove', dragBonzi);
    }

    function endDrag(event) {
      document.removeEventListener('mousemove', dragBonzi);
      const position = { x: bonzi.offsetLeft, y: bonzi.offsetTop };
      socket.emit('moveBonzi', position);
    }

    function dragBonzi(event) {
      bonzi.style.left = event.clientX + 'px';
      bonzi.style.top = event.clientY + 'px';
    }
