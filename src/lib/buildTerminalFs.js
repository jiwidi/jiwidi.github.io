import {
  homePages,
  writings,
  projects,
  creativeItems,
  photoCategories,
  keyboards,
  aboutPages,
} from './siteContent.js';

// Slug builder: turn a title into a usable filename inside the fake fs.
function slug(s) {
  return s
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 60);
}

// Convert a real link (internal /path or external https://) to the rTerm
// link sentinel string used by ls/cat/cd in rTerm.js.
function linkValue(link) {
  if (!link) return '';
  if (link.startsWith('http://') || link.startsWith('https://')) {
    return '_link:' + link;
  }
  return '_ilink:' + link;
}

// Convert a list of items into a folder object: { filename: linkValue }
function itemsToFolder(items, getName) {
  const folder = {};
  for (const it of items) {
    const name = getName(it);
    if (folder[name]) {
      // de-dupe collisions deterministically
      folder[name + '_' + Math.random().toString(36).slice(2, 5)] = linkValue(it.link);
    } else {
      folder[name] = linkValue(it.link);
    }
  }
  return folder;
}

export function buildTerminalData() {
  const writingFolder = itemsToFolder(writings, (it) => slug(it.title));
  const projectFolder = itemsToFolder(projects, (it) => slug(it.title));
  const creativeFolder = itemsToFolder(creativeItems, (it) => slug(it.title));
  const photoFolder = itemsToFolder(photoCategories, (it) => slug(it.name));

  // Keyboards: each entry becomes a "file" whose contents (cat) describe it,
  // plus a top-level _ilink to the page itself.
  const keyboardFolder = {
    'README.md': '_ilink:/keyboards',
  };
  for (const k of keyboards) {
    keyboardFolder[slug(k.name) + '.md'] = k.name + ' — ' + k.summary;
  }

  // About: short text plus links.
  const aboutFolder = {
    'README.md': '_ilink:/about',
    'principles.txt':
      '— Be kind.<br>' +
      '— Being normal is overrated.<br>' +
      '— People are defined by their actions, not their possessions.',
  };
  for (const p of aboutPages) {
    aboutFolder[slug(p.title) + '.md'] = linkValue(p.link);
  }

  // Top-level home directory mirrors the homePages list.
  const home = {
    'about':       aboutFolder,
    'projects':    projectFolder,
    'writing':     writingFolder,
    'creative':    creativeFolder,
    'keyboards':   keyboardFolder,
    'photography': photoFolder,
    'contact.txt': 'email: hi@imjai.me · github: <a class="link" href="https://github.com/jiwidi" target="_blank">jiwidi</a> · <a class="link" href="https://ecomid.com" target="_blank">ecomid.com</a>',
    '.secret':     'try: cat .secret/wise',
  };

  return {
    upstart: [
      'whoami',
      'ls',
      'echo type \'help\' or \'list\' for commands. cd into folders, cat files.',
    ],
    startblog: ['cd writing', 'ls'],
    startphotos: ['cd photography', 'ls'],
    startkeyboards: ['cd keyboards', 'ls'],
    uname: 'Linux jiwidi 5.15.0-jaime #1 SMP x86_64 GNU/Linux',
    whoami: [
      'jaime ferrando huertas',
      'data scientist · engineer · geek',
      'co-founder &amp; head of AI at <a class="link" href="https://ecomid.com" target="_blank">eComID</a>',
      'interests: photography, snow sports, cycling',
      'type \'help\' or \'list\' for commands.',
    ],
    pepe: [
      '         .--.        ',
      '        |o_o |       ',
      '        |:_/ |       ',
      '       //   \\ \\      ',
      '      (|     | )     ',
      '     /\'\\_   _/`\\     ',
      '     \\___)=(___/     ',
    ],
    tragedy: [
      'Did you ever hear the tragedy of Darth Plagueis the wise?',
      'I thought not. It\'s not a story the Jedi would tell you.',
    ],
    fs: {
      home: {
        jiwidi: home,
      },
    },
  };
}
