<template>
    <div class="category-grid">
      <div class="category-card" v-for="category in categories" :key="category.name" @click="goToCategory(category.link)">
        <img :src="category.image" :alt="category.name" class="category-image">
        <div class="category-name">{{ category.name }}</div>
      </div>
    </div>
  </template>

<script>
export default {
    name: 'CategoryGrid',
    data() {
        return {
            categories: [
                { name: 'Family', image: 'assets/img/photography/thumbnails/family/Paula Ferrando -82.jpg', link: '/photography/family', },
                { name: 'Nature', image: 'assets/img/photography/thumbnails/nature/39225246575_678b236c4e_o.jpg', link: '/photography/nature' },
                // { name: 'Faroe', image: 'src/assets/thumbnails/faroe/faroe_0149.jpg', link: '/photography/faroe' },
                // { name: 'Me&Tim', image: 'src/assets/thumbnails/me&tim/DSCF6245.jpg', link: '/photography/me&tim' },
                { name: 'Milu', image: 'assets/img/photography/thumbnails/milu/30_06_2023_0064.jpg', link: '/photography/milu' },
                { name: 'Life', image: 'assets/img/photography/thumbnails/life/Paula Ferrando -3.jpg', link: '/photography/life' },
                { name: 'Street', image: 'assets/img/photography/thumbnails/street/30_06_2023_0042-Enhanced.jpg', link: '/photography/street' },
                { name: 'Portraits', image: 'assets/img/photography/thumbnails/portraits/09_01_2024_0141.jpg', link: '/photography/portraits' },
            ],
        };
    },
    methods: {
        goToCategory(link) {
            this.$router.push(link);
        }
    }
};
</script>
