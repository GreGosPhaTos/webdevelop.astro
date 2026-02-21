export function initGlitchEffect(className: string, lang: string) {
  const glitchText = document.querySelector(className) as HTMLElement;
  if (!glitchText) return;

  const originalText = glitchText.innerText;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';

  const verbs =
    lang === 'en'
    ? ['Build', 'Create', 'Design', 'Scale', 'Ship', 'Solve']
    : ['Construire', 'Créer', 'Concevoir', 'Évoluer', 'Déployer', 'Résoudre'];
  let currentVerb = '';

  glitchText.addEventListener('mouseenter', () => {
    let iterations = 0;
    // Randomly select an action verb
    currentVerb = verbs[Math.floor(Math.random() * verbs.length)];
    const interval = setInterval(() => {
      glitchText.innerText = currentVerb
        .split('')
        .map((_letter, index) => {
          if (index < iterations) return currentVerb[index];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      if (iterations >= currentVerb.length) {
        clearInterval(interval);
        glitchText.innerText = currentVerb;
        glitchText.style.color = 'var(--color-accent)';
        setTimeout(() => {
          glitchText.innerText = originalText;
          glitchText.style.color = '';
        }, 1000);
      }
      iterations += 1 / 3;
    }, 30);
  });
}

export function initScrollEffects() {
  const nav = document.querySelector('.nav');
  if (nav) {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    }

    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }
}

