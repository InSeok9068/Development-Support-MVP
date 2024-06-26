const routes = [
  {
    path: '/',
    component: () => import('@/views/todo/TodoView.vue'),
  },
  {
    path: '/sign',
    component: () => import('@/views/sign/SignView.vue'),
  },
  {
    path: '/detail/:id',
    component: () => import('@/views/todo/TodoDetailView.vue'),
  },
  {
    path: '/list',
    component: () => import('@/views/todo/TodoListView.vue'),
  },
  {
    path: '/calendar',
    component: () => import('@/views/calendar/CalendarView.vue'),
  },
  {
    path: '/setting',
    component: () => import('@/views/setting/SettingView.vue'),
  },
];

export default routes;
