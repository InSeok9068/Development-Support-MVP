<template>
  <header class="container">
    <nav>
      <ul>
        <li>
          <h3><a class="contrast" href="/">업무관리</a></h3>
        </li>
        <li></li>
        <li>
          <router-link to="/" data-tooltip="Alt + 1" data-placement="bottom">
            <strong>Todo</strong>
          </router-link>
        </li>
        <li>
          <router-link to="/list" data-tooltip="Alt + 2" data-placement="bottom">
            <strong>List</strong>
          </router-link>
        </li>
        <li>
          <router-link to="/calendar" data-tooltip="Alt + 3" data-placement="bottom">
            <strong>Calendar</strong>
          </router-link>
        </li>
        <li>
          <router-link to="/dashboard" data-tooltip="Alt + 4" data-placement="bottom">
            <strong>Dashboard</strong>
          </router-link>
        </li>
        <li>
          <router-link to="/project-gantt" data-tooltip="Alt + 5" data-placement="bottom">
            <strong>Project Gantt</strong>
          </router-link>
        </li>
      </ul>
      <ul>
        <li>
          <details class="dropdown">
            <summary><i class="bi bi-gear-fill"></i></summary>
            <ul>
              <li v-show="!isAuth">
                <a href="#" @click.stop.prevent="$router.push('/sign')">로그인</a>
              </li>
              <li>
                <a href="#" @click.stop.prevent="$router.push('/setting')">설정</a>
              </li>
              <li>
                <a href="#" @click.stop.prevent="onClickClear">클리어</a>
              </li>
              <li v-show="isAuth">
                <a href="#" @click.stop.prevent="signout">로그아웃</a>
              </li>
            </ul>
          </details>
        </li>
        <li>
          <i
            :class="{
              'bi bi-bell cursor-pointer': global.notificationPermission === 'granted',
              'bi bi-bell-slash': global.notificationPermission !== 'granted',
            }"
            @click.stop.prevent="$router.push('/notification')"
          >
          </i>
          <span v-show="global.notificationDot" class="absolute h-1 w-1 animate-ping rounded-full bg-red-700"></span>
        </li>
        <li>
          <i
            class="cursor-pointer"
            :class="{
              'bi bi-brightness-high': global.theme === 'dark',
              'bi bi-brightness-high-fill': global.theme === 'white',
            }"
            @click="toggleTheme"
          ></i>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { useGlobal } from '@/composables/global';
import { useSign } from '@/composables/user/sign';
import { useMagicKeys } from '@vueuse/core';
import { watch } from 'vue';
import { useRouter } from 'vue-router';

/* ======================= 변수 ======================= */
const keys = useMagicKeys();
const router = useRouter();
const { signout, isAuth } = useSign();
const { global, toggleTheme } = useGlobal();
/* ======================= 변수 ======================= */

/* ======================= 생명주기 훅 ======================= */
watch(keys.alt_1, (v) => v && router.push('/'));

watch(keys.alt_2, (v) => v && router.push('/list'));

watch(keys.alt_3, (v) => v && router.push('/calendar'));

watch(keys.alt_4, (v) => v && router.push('/dashboard'));

watch(keys.alt_5, (v) => v && router.push('/project-gantt'));
/* ======================= 생명주기 훅 ======================= */

/* ======================= 메서드 ======================= */
const onClickClear = () => localStorage.clear();
/* ======================= 메서드 ======================= */
</script>
