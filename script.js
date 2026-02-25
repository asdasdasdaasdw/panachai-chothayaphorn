// Memory Card Game Logic
// Contact Form Logic
if (window.location.pathname.endsWith('contacts.html')) {
    const form = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const phone = form.phone.value.trim();
        const question = form.question.value.trim();
        if (!name || !email || !question) {
            formMessage.textContent = 'Please fill in all required fields.';
            formMessage.style.color = '#d32f2f';
            return;
        }
        if (!validateEmail(email)) {
            formMessage.textContent = 'Please enter a valid email address.';
            formMessage.style.color = '#d32f2f';
            return;
        }
        if (question.length < 10) {
            formMessage.textContent = 'Your question must be at least 10 characters.';
            formMessage.style.color = '#d32f2f';
            return;
        }
        formMessage.textContent = 'Thank you for contacting me! I will reply soon.';
        formMessage.style.color = '#244f8f';
        form.reset();
    });
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}
if (window.location.pathname.endsWith('game.html')) {
    const board = document.getElementById('game-board');
    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');
    const scoreBox = document.getElementById('score');
    const feedback = document.getElementById('feedback');

    let cards = [];
    let flipped = [];
    let matched = 0;
    let score = 0;
    let lock = false;

    const cardImages = [
        '', '💙', '💛', '💛', '💜', '💜', '💚', '💚',
        '🟦', '🟦', '🟩', '🟩', '🟪', '🟪', '🟧', '🟧'
    ];

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function createBoard() {
        board.innerHTML = '';
        cards = shuffle([...cardImages]);
        matched = 0;
        score = 0;
        scoreBox.textContent = score;
        feedback.textContent = 'Find all pairs!';
        lock = false;
        flipped = [];
        cards.forEach((img, idx) => {
            const card = document.createElement('button');
            card.className = 'memory-card';
            card.setAttribute('data-index', idx);
            card.setAttribute('aria-label', 'Memory card');
            card.setAttribute('tabindex', '0');
            card.innerHTML = '<span class="card-back">❓</span>';
            card.addEventListener('click', () => flipCard(card, idx));
            board.appendChild(card);
        });
    }

    function flipCard(card, idx) {
        if (lock || card.classList.contains('matched') || card.classList.contains('flipped')) return;
        card.classList.add('flipped');
        card.innerHTML = `<span class="card-front">${cards[idx]}</span>`;
        card.style.transition = 'transform 0.3s, background 0.3s';
        card.style.transform = 'scale(1.08)';
        setTimeout(() => { card.style.transform = ''; }, 350);
        card.focus();
        flipped.push({card, idx});
        if (flipped.length === 2) {
            lock = true;
            score++;
            scoreBox.textContent = score;
            setTimeout(checkMatch, 800);
        }
    }

    function checkMatch() {
        const [first, second] = flipped;
        if (cards[first.idx] === cards[second.idx]) {
            first.card.classList.add('matched');
            second.card.classList.add('matched');
            matched += 2;
            feedback.textContent = 'Matched!';
        } else {
            first.card.classList.remove('flipped');
            second.card.classList.remove('flipped');
            first.card.innerHTML = '<span class="card-back">❓</span>';
            second.card.innerHTML = '<span class="card-back">❓</span>';
            feedback.textContent = 'Try again!';
        }
        flipped = [];
        lock = false;
        if (matched === cards.length) {
            feedback.textContent = `You won in ${score} turns! 🎉`;
        }
    }

    startBtn.addEventListener('click', createBoard);
    resetBtn.addEventListener('click', createBoard);
    // Auto start on page load
    window.addEventListener('DOMContentLoaded', createBoard);
}
