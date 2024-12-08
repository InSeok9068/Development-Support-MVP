<template>
  <main class="container">
    <article>
      <div class="grid">
        <label>
          등록일자 (FROM)
          <input v-model="listFilter.createdFrom" type="date" />
        </label>
        <label>
          등록일자 (TO)
          <input v-model="listFilter.createdTo" type="date" />
        </label>
        <label>
          완료일자
          <input v-model="listFilter.doneDate" type="date" />
        </label>
      </div>

      <div class="grid">
        <label>
          완료여부
          <input v-model="listFilter.done" type="checkbox" role="switch" />
        </label>
      </div>

      <details>
        <summary role="button" class="outline">옵션 더보기</summary>
        <div class="grid">
          <label>
            수정일자 (FROM)
            <input v-model="listFilter.updatedFrom" type="date" />
          </label>
          <label>
            수정일자 (TO)
            <input v-model="listFilter.updatedTo" type="date" />
          </label>
          <label>
            마감일자
            <input v-model="listFilter.dueDate" type="date" />
          </label>
          <label>
            개발자
            <select v-model="listFilter.developer">
              <option value="ALL">
                <span></span>
              </option>
              <option value="">
                <span>미배정</span>
              </option>
              <template v-for="developer in developers">
                <option :value="developer.id">
                  <span>{{ developer.name }}</span>
                </option>
              </template>
            </select>
          </label>
        </div>
        <div class="grid">
          <label>
            주간보고서
            <input v-model="weeklyReport" type="checkbox" role="switch" @change="onChangeSetWeeklyReportDate" />
          </label>
        </div>
      </details>

      <form role="search">
        <input v-model="listFilter.text" type="search" @keydown.stop.prevent.enter="onClickSearch" />
        <input type="button" value="검색" @click="onClickSearch" />
      </form>

      <AgGridVue
        :class="global.theme == 'white' ? 'ag-theme-material' : 'ag-theme-material-dark'"
        :grid-options="gridOptions"
        :column-defs="columns"
        :row-data="rowData"
        :pagination="true"
        :pagination-page-size="15"
        :pagination-page-size-selector="[15, 30, 100]"
      />
    </article>
  </main>
</template>

<script setup lang="ts">
import 'ag-grid-community/styles/ag-grid.min.css';
import 'ag-grid-community/styles/ag-theme-material.css';
// import 'ag-grid-community/styles/ag-theme-quartz.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';
import pb from '@/api/pocketbase';
import type { DevelopersResponse, WorksResponse } from '@/api/pocketbase-types';
import { useSearch } from '@/composables/todo/search';
import { useWork } from '@/composables/todo/work';
import { AgGridVue } from 'ag-grid-vue3';
import type { GridOptions, ColDef, RowClickedEvent } from 'ag-grid-community';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import type { UiWorkList } from '@/ui/todo.ui';
import { useGlobal } from '@/composables/global';
dayjs.extend(weekday);

/* ======================= 변수 ======================= */
const router = useRouter();
const { works, selectWorkList } = useWork();
const { listFilter } = useSearch();
const { global } = useGlobal();
const developers = ref<DevelopersResponse[]>([]);
const weeklyReport = ref(false);
const gridOptions: GridOptions = {
  domLayout: 'autoHeight',
  autoSizeStrategy: {
    type: 'fitGridWidth',
  },
  onRowClicked(event: RowClickedEvent) {
    router.push(`/detail/${event.data.id}`);
  },
};
const columns = ref<ColDef<UiWorkList>[]>([
  { field: 'title', headerName: '제목' },
  { field: 'developer', headerName: '개발자', width: 50 },
  { field: 'created', headerName: '등록일자', width: 80 },
  { field: 'updated', headerName: '수정일자', width: 80 },
]);
const rowData = ref<UiWorkList[]>([]);
/* ======================= 변수 ======================= */

/* ======================= 감시자 ======================= */
watch(works, (newValue) => {
  rowData.value = newValue.map((work: WorksResponse) => ({
    id: work.id,
    title: work.title,
    developer: developers.value.find((developer: DevelopersResponse) => developer.id === work.developer)?.name ?? '',
    created: dayjs(work.created).format('YYYY-MM-DD HH:mm:ss'),
    updated: dayjs(work.updated).format('YYYY-MM-DD HH:mm:ss'),
  }));
});

/* ======================= 감시자 ======================= */

/* ======================= 생명주기 훅 ======================= */
onMounted(() => {
  selectDeveloperFullList();
  onClickSearch();
});
/* ======================= 생명주기 훅 ======================= */

/* ======================= 메서드 ======================= */
const onClickSearch = () => {
  selectWorkList({
    filter: `
      title ~ '${listFilter.value.text}'
      && created >= '${listFilter.value.createdFrom}'
      && created <= '${listFilter.value.createdTo} 23:59:59'
      && done = ${listFilter.value.done}
      ${listFilter.value.doneDate && `&& doneDate ~ '${listFilter.value.doneDate}'`}
      ${listFilter.value.dueDate && `&& dueDate ~ '${listFilter.value.dueDate}'`}
      ${listFilter.value.updatedFrom && `&& updated >= '${listFilter.value.updatedFrom}'`}
      ${listFilter.value.updatedTo && `&& updated <= '${listFilter.value.updatedTo} 23:59:59'`}
      ${listFilter.value.developer !== 'ALL' ? `&& developer = '${listFilter.value.developer}'` : ''}
    `,
    perPage: 100000,
  });
};

const onChangeSetWeeklyReportDate = () => {
  if (weeklyReport.value) {
    listFilter.value.updatedFrom = dayjs(new Date()).startOf('week').add(1, 'day').format('YYYY-MM-DD');
    listFilter.value.updatedTo = dayjs(new Date()).startOf('week').add(5, 'day').format('YYYY-MM-DD');
  } else {
    listFilter.value.updatedFrom = '';
    listFilter.value.updatedTo = '';
  }
};

const selectDeveloperFullList = async () => {
  developers.value = await pb.collection('developers').getFullList({
    filter: `del = false`,
    sort: 'sort',
  });
};
/* ======================= 메서드 ======================= */
</script>

<style>
.ag-paging-button {
  background-color: var(--ag-background-color);
  border-color: var(--ag-border-color);
}
</style>
