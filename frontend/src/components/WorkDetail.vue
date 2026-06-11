<script setup lang="ts">
import { ref } from "vue";
import { useWorkStore } from "../stores/workStore";
import type { CraftWork } from "../types/work";

const props = defineProps<{ work: CraftWork | null }>();
defineEmits<{ close: []; follow: [string] }>();

const store = useWorkStore();
const commentText = ref("");

function submitComment() {
  if (!props.work || !commentText.value.trim()) return;
  store.addComment(props.work.id, commentText.value.trim());
  commentText.value = "";
}

function formatTime(iso: string) {
  const date = new Date(iso);
  const diff = Date.now() - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diff < minute) return "刚刚";
  if (diff < hour) return `${Math.floor(diff / minute)}分钟前`;
  if (diff < day) return `${Math.floor(diff / hour)}小时前`;
  if (diff < 7 * day) return `${Math.floor(diff / day)}天前`;
  return date.toLocaleDateString();
}
</script>

<template>
  <div v-if="work" class="detail-mask" @click.self="$emit('close')">
    <section class="detail">
      <button class="close" @click="$emit('close')">×</button>
      <div class="carousel"><img v-for="img in work.images" :key="img" :src="img" :alt="work.title" /></div>
      <h2>{{ work.title }}</h2>
      <p>{{ work.description }}</p>
      <h3>材料清单</h3><ul><li v-for="m in work.materials" :key="m">{{ m }}</li></ul>
      <h3>制作步骤</h3><ol><li v-for="step in work.steps" :key="step">{{ step }}</li></ol>
      <footer><strong>{{ work.author.name }}</strong><span>{{ work.author.bio }}</span><button @click="$emit('follow', work.author.id)">{{ work.author.followed ? "已关注" : "关注作者" }}</button></footer>
      <div class="discussion">
        <h3 class="discussion-title">讨论区 <span class="count">{{ work.comments.length }}</span></h3>
        <div class="comment-input">
          <textarea v-model="commentText" placeholder="说说你的看法、提问或晒出你的成品..." rows="3"></textarea>
          <div class="comment-actions">
            <span class="hint">{{ commentText.length }}/500</span>
            <button :disabled="!commentText.trim()" @click="submitComment">发布留言</button>
          </div>
        </div>
        <div class="comment-list">
          <div v-if="work.comments.length === 0" class="empty">还没有留言，来抢沙发吧～</div>
          <div v-for="c in work.comments.slice().reverse()" :key="c.id" class="comment-item">
            <div class="avatar">{{ c.author.slice(0, 1) }}</div>
            <div class="comment-body">
              <div class="comment-header">
                <strong>{{ c.author }}</strong>
                <span class="time">{{ formatTime(c.createdAt) }}</span>
              </div>
              <p class="comment-content">{{ c.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
