<template>
  <main class="container">
    <Bar :data="data" />
  </main>
</template>

<script setup lang="ts">
import { Chart, type ChartData, registerables } from 'chart.js';
import { ref } from 'vue';
import { Bar } from 'vue-chartjs';

Chart.register(...registerables);

/* ======================= 변수 ======================= */
const data = ref<ChartData<'bar'>>({
  datasets: [
    {
      label: '테스트',
      data: [],
    },
  ],
});
/* ======================= 변수 ======================= */
</script>
