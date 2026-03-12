document.addEventListener('DOMContentLoaded', () => {
    // 1. Header scroll effect
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Language Toggle
    const langBtns = document.querySelectorAll('.lang-btn');
    let currentLang = localStorage.getItem('woori_lang') || 'en';

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('woori_lang', lang);

        // 버튼 활성화 상태 업데이트
        langBtns.forEach(btn => {
            if (btn.textContent.toLowerCase() === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // 번역 텍스트 업데이트 (translations 객체는 lang.js에 정의됨)
        if (typeof translations !== 'undefined') {
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (translations[lang] && translations[lang][key]) {
                    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                        el.placeholder = translations[lang][key];
                    } else {
                        // innerHTML을 사용하여 <br> 태그 등 유지
                        el.innerHTML = translations[lang][key];
                    }
                }
            });
        }
    }

    // 초기 언어 설정 적용
    setLanguage(currentLang);

    langBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const selectedLang = e.target.textContent.toLowerCase();
            setLanguage(selectedLang);
        });
    });

    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const gnb = document.querySelector('.gnb');

    if (mobileBtn && gnb) {
        mobileBtn.addEventListener('click', () => {
            mobileBtn.classList.toggle('active');
            gnb.classList.toggle('active');
        });
    }

    // 3. Smooth Scroll for Anchor Links (Hybrid Nav)
    document.querySelectorAll('.gnb a, .smooth-scroll').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // 링크가 현재 페이지 내의 앵커(#)를 가리키고 있는지 판단
            const isHashLink = href.startsWith('#') || href.includes(window.location.pathname + '#');

            if (isHashLink) {
                const targetId = href.split('#')[1];
                if (!targetId) return;

                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
            // 그 외(commerce.html 등 다른 파일)는 기본 속성대로 페이지 이동 진행됨
        });
    });

    // 외부 페이지에서 index.html#about 등으로 진입했을 때의 스크롤 처리
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            setTimeout(() => {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }

    // 4. Scroll Animation Observer (Fallback CSS 해제 역할)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    // 섹션 등 애니메이션 대상 감시
    document.querySelectorAll('section, .fade-in-safe').forEach(el => {
        observer.observe(el);
    });

    // 5. Timeline Scroll Observer
    const timelineOptions = {
        root: null,
        rootMargin: '-20% 0px -20% 0px',
        threshold: 0
    };

    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, timelineOptions);

    document.querySelectorAll('.timeline-item').forEach(item => {
        timelineObserver.observe(item);
    });
});
