export function navigationEvents() {
    const aside = document.querySelector('#filters');
    const buttons = document.querySelectorAll('.btn-header-menu');

    if (!aside || !buttons.length) return;

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            aside.classList.toggle('invisible-aside');
        });
    });
}
