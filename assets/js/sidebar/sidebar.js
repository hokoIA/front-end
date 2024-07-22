const sidebar = document.getElementById('layout-menu');
const hoverArea = document.getElementById('hover-area');

hoverArea.addEventListener('mouseenter', () => {
    sidebar.style.left = '0';
});

hoverArea.addEventListener('mouseleave', () => {
    sidebar.style.left = '-250px';
});

sidebar.addEventListener('mouseenter', () => {
    sidebar.style.left = '0';
});

sidebar.addEventListener('mouseleave', () => {
    sidebar.style.left = '-250px';
});
