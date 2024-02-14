<template>
    <nav class="articles-list" id="nav">
      <hr />
      <ul>
        <li>
          <router-link to=".."> <!-- Adjust the path as needed -->
            <div class="arrow_back_icon"></div>
          </router-link>
        </li>
        <li v-for="item in listItems" :key="item.title" class="bg2">
          <component :is="getLinkComponent(item.link)" :href="item.link" :to="item.link" class="link-content">
            <span :class="item.icon + ' icon'"></span>
            <span class="text-title">{{ item.title }}</span>
            <span v-if="item.description" class="text-description"> — {{ item.description }}</span>
            <time v-if="item.date" class="date">{{ item.date }}</time>
          </component>
        </li>
      </ul>
    </nav>
  </template>

<script>
export default {
    name: 'ListDisplay',
    props: {
        listItems: {
            type: Array,
            required: true,
        },
    },
    methods: {
        isExternal(link) {
            return /^(https?:|mailto:|tel:)/.test(link);
        },
        getLinkComponent(link) {
            return this.isExternal(link) ? 'a' : 'router-link';
        }
    },
};
</script>
