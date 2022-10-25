function set_theme(a) {
    var theme = localStorage.getItem('data-theme');
    if (theme == 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/assets/light.css';
        document.head.appendChild(link);
    } else if (theme == 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/assets/dark.css';
        document.head.appendChild(link);
    } else {
        console.log("default")
        document.documentElement.setAttribute('data-theme', 'light');
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/assets/light.css';
        document.head.appendChild(link);
    }
}

set_theme()
var aux = document.createElement('link');
aux.rel = 'stylesheet';
aux.href = '/assets/styles.css';
document.head.appendChild(aux);


function toggle(a) {
    var theme = localStorage.getItem('data-theme');

    if (theme == 'light') {
        document.documentElement.classList.add('transition');
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('data-theme', 'dark');
    } else if (theme == 'dark') {
        document.documentElement.classList.add('transition');
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('data-theme', 'light');
    } else {
        document.documentElement.classList.add('transition');
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('data-theme', 'light');
    }
    set_theme(a)
};

// Helper function
let domReady = (cb) => {
    document.readyState === 'interactive' || document.readyState ===
        'complete' ?
        cb() :
        document.addEventListener('DOMContentLoaded', cb);
};

domReady(() => {
    // Display body when DOM is loaded
    document.body.style.visibility = 'visible';
    // document.body.style.opacity = '1';
});