document.addEventListener('DOMContentLoaded', () => {
    const chessboard = document.getElementById('chessboard');
    const resetBtn = document.getElementById('resetBtn');
    const flipBtn = document.getElementById('flipBtn');
    const statusMessage = document.getElementById('status-message');
    const fenDisplay = document.getElementById('fen-display');

    let board = [];
    let selectedSquare = null;
    let isFlipped = false;

    const initialFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

    const pieceImages = {
        'p': 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg',
        'n': 'https://upload.wikimedia.org/wikipedia/commons/8/81/Chess_ndt45.svg',
        'b': 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Chess_bdt45.svg',
        'r': 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg',
        'q': 'https://upload.wikimedia.org/wikipedia/commons/a/af/Chess_qdt45.svg',
        'k': 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Chess_kdt45.svg',
        'P': 'https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg',
        'N': 'https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg',
        'B': 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Chess_blt45.svg',
        'R': 'https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg',
        'Q': 'https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qlt45.svg',
        'K': 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_klt45.svg'
    };

    function createBoard() {
        chessboard.innerHTML = '';
        board = [];
        for (let i = 0; i < 8; i++) {
            let row = [];
            for (let j = 0; j < 8; j++) {
                const square = document.createElement('div');
                square.classList.add('square');
                square.dataset.row = i;
                square.dataset.col = j;
                const isLight = (i + j) % 2 === 0;
                square.classList.add(isLight ? 'light' : 'dark');
                square.addEventListener('click', handleSquareClick);
                row.push(square);
                chessboard.appendChild(square);
            }
            board.push(row);
        }
        if (isFlipped) {
            chessboard.style.flexDirection = 'column-reverse';
            board.forEach(row => {
                row.forEach(square => {
                    square.style.order = (7 - parseInt(square.dataset.row)) * 8 + (7 - parseInt(square.dataset.col));
                });
            });
        } else {
            chessboard.style.flexDirection = 'column';
            board.forEach(row => {
                row.forEach(square => {
                    square.style.order = parseInt(square.dataset.row) * 8 + parseInt(square.dataset.col);
                });
            });
        }
        loadFen(initialFen);
    }

    function loadFen(fen) {
        const parts = fen.split(' ');
        const boardFen = parts[0];
        let row = 0;
        let col = 0;

        for (const char of boardFen) {
            if (char === '/') {
                row++;
                col = 0;
            } else if (/\d/.test(char)) {
                col += parseInt(char);
            } else {
                const square = board[row][col];
                const pieceImg = document.createElement('img');
                pieceImg.src = pieceImages[char];
                pieceImg.alt = char;
                square.appendChild(pieceImg);
                col++;
            }
        }
        updateStatus();
        updateFenDisplay(fen);
    }

    function getFen() {
        let fen = '';
        for (let i = 0; i < 8; i++) {
            let emptyCount = 0;
            for (let j = 0; j < 8; j++) {
                const square = board[i][j];
                if (square.children.length > 0) {
                    if (emptyCount > 0) {
                        fen += emptyCount;
                        emptyCount = 0;
                    }
                    fen += square.children[0].alt;
                } else {
                    emptyCount++;
                }
            }
            if (emptyCount > 0) {
                fen += emptyCount;
            }
            if (i < 7) {
                fen += '/';
            }
        }
        // Add active color, castling availability, en passant target square, halfmove clock, fullmove number
        // For simplicity, we'll just use default values for now
        return fen + ' w KQkq - 0 1';
    }

    function updateStatus() {
        statusMessage.textContent = 'White to move'; // Placeholder
    }

    function updateFenDisplay(fen) {
        fenDisplay.textContent = `FEN: ${fen}`;
    }

    function handleSquareClick(event) {
        const clickedSquare = event.currentTarget;
        if (selectedSquare) {
            // Move piece
            const piece = selectedSquare.querySelector('img');
            if (piece) {
                clickedSquare.innerHTML = ''; // Clear target square
                clickedSquare.appendChild(piece);
            }
            selectedSquare.classList.remove('highlight');
            selectedSquare = null;
            updateFenDisplay(getFen());
        } else {
            // Select piece
            if (clickedSquare.querySelector('img')) {
                selectedSquare = clickedSquare;
                selectedSquare.classList.add('highlight');
            }
        }
    }

    resetBtn.addEventListener('click', () => {
        createBoard();
    });

    flipBtn.addEventListener('click', () => {
        isFlipped = !isFlipped;
        createBoard(); // Re-create board to apply flip
    });

    createBoard();
});
