// function set_theme(a) {
//     var theme = localStorage.getItem('data-theme');
//     console.log("click", theme)
//     if (theme == 'light') {
//         document.documentElement.setAttribute('data-theme', 'light');
//         var link = document.createElement('link');
//         link.rel = 'stylesheet';
//         link.href = '/assets/light.css';
//         document.head.appendChild(link);
//     } else if (theme == 'dark') {
//         document.documentElement.setAttribute('data-theme', 'dark');
//         var link = document.createElement('link');
//         link.rel = 'stylesheet';
//         link.href = '/assets/dark.css';
//         document.head.appendChild(link);
//     } else {
//         console.log("default")
//         document.documentElement.setAttribute('data-theme', 'light');
//         var link = document.createElement('link');
//         link.rel = 'stylesheet';
//         link.href = '/assets/light.css';
//         document.head.appendChild(link);
//     }
// }

// set_theme()
// var aux = document.createElement('link');
// aux.rel = 'stylesheet';
// aux.href = '/assets/styles.css';
// document.head.appendChild(aux);

const storageKey = 'theme-preference'

const onClick = () => {
    // flip current value
    theme.value = theme.value === 'light' ?
        'dark' :
        'light'

    setPreference()
}

const getColorPreference = () => {
    if (localStorage.getItem(storageKey))
        return localStorage.getItem(storageKey)
    else
        return window.matchMedia('(prefers-color-scheme: dark)').matches ?
            'dark' :
            'light'
}

const setPreference = () => {
    localStorage.setItem(storageKey, theme.value)
    reflectPreference()
}

const reflectPreference = () => {
    document.firstElementChild
        .setAttribute('data-theme', theme.value)

    document
        .querySelector('#theme-toggle')
        .setAttribute('aria-label', theme.value)
}

const theme = {
    value: getColorPreference(),
}

// set early so no page flashes / CSS is made aware
document.firstElementChild
    .setAttribute('data-theme', theme.value)

window.onload = () => {
    // set on load so screen readers can see latest value on the button
    reflectPreference()
        // now this script can find and listen for clicks on the control
    document
        .querySelector('#theme-toggle')
        .addEventListener('click', onClick)
}

// sync with system changes
window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', ({
        matches: isDark
    }) => {
        theme.value = isDark ? 'dark' : 'light'
        setPreference()
    })