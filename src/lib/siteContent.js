// Single source of truth for site content. Used by both views and the
// terminal mode so they always show the same data.

export const homePages = [
  { title: 'Projects',    link: '/projects',    description: '12 repos' },
  { title: 'Writing',     link: '/writing',     description: '11 pieces' },
  { title: 'Creative',    link: '/creative',    description: '9 finds' },
  { title: 'Photography', link: '/photography', description: '7 sets' },
  { title: 'About',       link: '/about',       description: 'readme' },
];

export const writings = [
  { title: "The AI Revolution: Interfaces, Not Intelligence",                       description: "opinions",     link: "/writing/ai_revolution_interfaces" },
  { title: "Explaining Preferences with Shapley Values",                            description: "neurips 2022", link: "https://arxiv.org/pdf/2205.13662.pdf" },
  { title: "Fashion Recommender Systems with Focus on Time and Seasonality",       description: "thesis",       link: "https://github.com/jiwidi/MASTER_THESIS/blob/master/thesis.pdf" },
  { title: "Twitter's Open Source Algorithm — Unveiling the Code, but Not the Secrets", description: "opinions", link: "/writing/twitter_open_source_algorithm" },
  { title: "GPT-4: A New Milestone in Scaling Up Deep Learning",                    description: "opinions",     link: "/writing/gpt4_release" },
  { title: "Size Isn't Everything — How LLaMA Democratizes Access to Large Language Models", description: "opinions", link: "/writing/llama_size_isnt_everything" },
  { title: "Microsoft vs Google — ChatGPT Taking Over Search?",                     description: "opinions",     link: "/writing/search_google_vs_microsoft" },
  { title: "Why Your Feeds Are Getting Worse Over Time",                            description: "opinions",     link: "/writing/feeds_worse_overtime" },
  { title: "Your Browsing Behavior Is Being Modeled as a Language",                 description: "opinions",     link: "/writing/browser_behavior_language" },
  { title: "Takeaways from the 2022 NVIDIA RecSys Workshop",                        description: "notes",        link: "/writing/takeaways_nvidia_22" },
  { title: "RecSys 2022 — Favorite Papers and Talks",                               description: "notes",        link: "/writing/recsys_2022" },
];

export const projects = [
  { title: "Behavior Sequence Transformer (PyTorch)",  description: "pytorch · recsys",      link: "https://github.com/jiwidi/Behavior-Sequence-Transformer-Pytorch" },
  { title: "Time Series Forecasting with Python",      description: "python · forecasting",  link: "https://github.com/jiwidi/time-series-forecasting-with-python" },
  { title: "DeepSpeech (PyTorch)",                     description: "pytorch · asr",         link: "https://github.com/jiwidi/DeepSpeech-pytorch" },
  { title: "Listen, Attend and Spell (PyTorch)",       description: "pytorch · asr",         link: "https://github.com/jiwidi/las-pytorch" },
  { title: "JupyterLab Docker for Raspberry Pi",       description: "docker · rpi",          link: "https://github.com/jiwidi/jupyter-lab-docker-rpi" },
  { title: "DailyQwertee",                             description: "scraper · bot",         link: "https://github.com/jiwidi/DailyQwertee" },
  { title: "Lens Database",                            description: "live · database",       link: "https://www.lens-database.com/" },
  { title: "This Personal Website",                    description: "source",                link: "https://github.com/jiwidi/jiwidi.github.io" },
  { title: "Master's Thesis",                          description: "thesis",                link: "https://github.com/jiwidi/MASTER_THESIS" },
  { title: "GMM Classifier",                           description: "stats · ml",            link: "https://github.com/jiwidi/gmm-classifier" },
  { title: "Netflix RNN Recommender",                  description: "rnn · recsys",          link: "https://github.com/jiwidi/Netflix-RNN-Recommender" },
  { title: "Dotfiles",                                 description: "unix · config",         link: "https://github.com/jiwidi/dotfiles" },
];

export const creativeItems = [
  { title: "The Mechanical Watch",                description: "ciechanow.ski", link: "https://ciechanow.ski/mechanical-watch/" },
  { title: "Forgotten Ideas of CS",               description: "pdf",           link: "https://codesync.global/uploads/media/default/0001/01/de7dfa6889612b31caf9ffa5b3377ee57be54cfd.pdf" },
  { title: "The World Has Become Less Colorful",  description: "archdaily",     link: "https://www.archdaily.com/993197/is-the-world-less-colorful-highlighting-the-color-evolution-of-objects-and-spaces" },
  { title: "Scapes",                              description: "tumblr",        link: "https://futuretage.tumblr.com/" },
  { title: "40 Questions",                        description: "kepano",        link: "https://github.com/kepano/40-questions" },
  { title: "Dracula Theme",                       description: "draculatheme",  link: "https://draculatheme.com/" },
  { title: "How Do Rangefinder Cameras Focus?",   description: "youtube",       link: "https://www.youtube.com/watch?v=4fuPYirmous" },
  { title: "The Age of Average",                  description: "alex murrell",  link: "https://www.alexmurrell.co.uk/articles/the-age-of-average" },
  { title: "Tastiness of Watermelon",             description: "internal",      link: "/creative/watermelon" },
  { title: "If— by Rudyard Kipling",              description: "poem",          link: "/creative/kipling_if" },
  { title: "First season of True Detective",      description: "a masterpiece", link: "https://www.imdb.com/title/tt2356777/" },
  { title: "Many Keyboards!",                     description: "7 builds",      link: "/creative/keyboards" },
];

// Ordered — the order defines set numbers (01, 02, …) across the
// photography index, the set meta line, and prev/next navigation.
// `size` curates the index mosaic: hero (4×2), tall (2×2, portrait
// covers), half (3×1), std (2×1) on the 6-column desktop grid.
export const photoCategories = [
  { name: 'Family',    slug: 'family',    size: 'hero', image: '/assets/img/photography/thumbnails/family/Paula Ferrando -82.jpg',       link: '/photography/family' },
  { name: 'Portraits', slug: 'portraits', size: 'tall', image: '/assets/img/photography/thumbnails/portraits/09_01_2024_0141.jpg',       link: '/photography/portraits' },
  { name: 'Street',    slug: 'street',    size: 'half', image: '/assets/img/photography/thumbnails/street/30_06_2023_0042-Enhanced.jpg', link: '/photography/street' },
  { name: 'Nature',    slug: 'nature',    size: 'half', image: '/assets/img/photography/thumbnails/nature/39225246575_678b236c4e_o.jpg', link: '/photography/nature' },
  { name: 'Milu',      slug: 'milu',      size: 'std',  image: '/assets/img/photography/thumbnails/milu/30_06_2023_0064.jpg',            link: '/photography/milu' },
  { name: 'Life',      slug: 'life',      size: 'std',  image: '/assets/img/photography/thumbnails/life/Paula Ferrando -3.jpg',          link: '/photography/life' },
  { name: 'Faroe',     slug: 'faroe',     size: 'std',  image: '/assets/img/photography/thumbnails/faroe/faroe_0233.jpg',                link: '/photography/faroe' },
];

export const keyboards = [
  { name: 'Zoom 65',       summary: 'Dracula GMK · 67g Tangerines · Brass plate' },
  { name: 'Tofu Jr',       summary: 'Striker GMK · Gateron Oil King 67g · PC plate' },
  { name: 'Discipline 65', summary: 'Akko Macaw · 67g Durock v1 tactile · plateless' },
  { name: 'Idobao id80v2', summary: 'GMK Mito + Maxkey SA · holy pandas 67g' },
  { name: 'KBD 67 Lite',   summary: 'GMK Modern Dolch Light · 67g Tangerines' },
  { name: 'Satan GH60',    summary: 'SA blue/white · walnut case · marshmallow' },
  { name: 'Tada68',        summary: 'Generic caps · ABS case · Zealios v1 67g' },
];

export const aboutPages = [
  { title: 'Curriculum Vitae', description: 'pdf · github', link: 'https://github.com/jiwidi/CurriculumVitae/blob/master/JaimeFerrandoHuertas_CV.pdf' },
];
