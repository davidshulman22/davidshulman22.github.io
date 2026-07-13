const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.main-nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.dataset.open !== 'true';
    nav.dataset.open = String(open);
    toggle.setAttribute('aria-expanded', String(open));
  });
}

document.querySelectorAll('[data-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const previewForm = document.querySelector('[data-preview-form]');
if (previewForm) {
  previewForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const status = previewForm.querySelector('.form-status');
    status.textContent = 'This staging form does not send information. Please use the live firm site for an actual inquiry.';
  });
}
