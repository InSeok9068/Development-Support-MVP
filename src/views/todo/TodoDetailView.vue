<template>
  <main class="container">
    <article>
      <nav>
        <ul>
          <li>
            <h4>제목</h4>
          </li>
        </ul>
        <ul>
          <li>
            <h4><i class="bi bi-floppy" style="cursor: pointer" @click="updateWork"></i></h4>
          </li>
          <li>
            <h4><i class="bi bi-trash" style="cursor: pointer" @click="deleteWork(work)"></i></h4>
          </li>
        </ul>
      </nav>
      <input v-model="work.title" style="font-size: xx-large" />
      <div role="group">
        <!-- <label>
          마크다운 VIEW
          <input type="checkbox" role="switch" @change="switchView" />
        </label> -->
        <label>
          완료여부
          <input v-model="work.done" type="checkbox" role="switch" @change="onChangeDone" />
        </label>
      </div>
      <label>
        <strong>내용</strong>
        <textarea v-model="work.content" rows="10"></textarea>
      </label>
      <label>
        <strong>레드마인 URL</strong>
        <div role="group">
          <input v-model="work.redmine" type="url" />
          <button v-show="work.redmine" @click="onClickRedmine(work.redmine)">OPEN</button>
        </div>
      </label>
      <label>
        <strong>조플린 URL</strong>
        <div role="group">
          <input v-model="work.joplin" type="url" />
          <button v-show="work.joplin" @click="onClickJoplin(work.joplin)">OPEN</button>
        </div>
      </label>
      <label>
        <strong>개발자</strong>
        <select v-model="work.developer">
          <template v-for="developer in developers">
            <option :value="developer.id" :selected="work.developer == developer.id">
              <span>{{ developer.name }}</span>
            </option>
          </template>
        </select>
      </label>
      <div role="group">
        <label>
          <strong>마감일시</strong>
          <input
            :value="dayjs(work.dueDate).format('YYYY-MM-DD')"
            type="date"
            @input="(e) => (work.dueDate = (e.target as any).value)"
          />
        </label>
      </div>
      <div role="group">
        <label>
          <strong>완료일시</strong>
          <input readonly :value="work.doneDate && dayjs(work.doneDate).format('YYYY-MM-DD HH:mm:ss')" />
        </label>
        <label>
          <strong>등록일시</strong>
          <input readonly :value="dayjs(work.created).format('YYYY-MM-DD HH:mm:ss')" />
        </label>
        <label>
          <strong>수정일시</strong>
          <input readonly :value="dayjs(work.updated).format('YYYY-MM-DD HH:mm:ss')" />
        </label>
      </div>
    </article>
  </main>
</template>

<script setup lang="ts">
import { useDeveloper } from '@/composables/todo/developer';
import { useWork } from '@/composables/todo/work';
import { useMagicKeys } from '@vueuse/core';
import dayjs from 'dayjs';
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

const { work, selectWork, updateWork, deleteWork } = useWork();
const { developers, selectDeveloperFullList } = useDeveloper();
const route = useRoute();
const keys = useMagicKeys();

watch(keys.shift_enter, (v) => {
  v && updateWork();
});

onMounted(() => {
  selectWork(route.params.id as string);
  selectDeveloperFullList();
});

const onChangeDone = () => {
  if (work.value.done) {
    work.value.doneDate = new Date().toISOString();
  } else {
    work.value.doneDate = '';
  }
};

const onClickRedmine = (url: string) => {
  window.open('about:blank')!.location.href = url;
};

const onClickJoplin = (url: string) => {
  location.href = url;
};
</script>
@/composables/todo/developer@/composables/todo/work