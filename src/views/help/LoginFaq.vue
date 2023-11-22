<script setup lang="ts">
import FaqView from "@/components/help/FaqView.vue"
import { ref } from "vue"

const activeKey = ref(0)
</script>

<template>
  <faq-view title="登录相关问题">
    <template #default>
      <a-collapse v-model:active-key="activeKey" ghost>
        <a-collapse-panel key="1" header="我想要注册本论坛">
          <p>目前，本论坛尚未开放运行，仅限选课学生和助教、教师使用。</p>
          <p>
            如果您已经选修了“高级语言程序设计”“面向对象”或其他使用本论坛的课程，您可以直接用交作业的网站的账户和密码登录。
          </p>
          <p>若您还没有登录过交作业网站，请先前往交作业网站登录并修改初始密码。</p>
        </a-collapse-panel>
        <a-collapse-panel key="2" header="我忘记了密码">
          <p>首先，本网站使用的密码是交作业网站的密码，请使用交作业网站的密码登录。</p>
          <p>如果您确实忘记了交作业网站的密码，请联系教师重置。</p>
        </a-collapse-panel>
        <a-collapse-panel key="3" header="我想要修改密码">
          <p>本网站使用的密码是交作业网站的密码，直接前往交作业网站修改即可。</p>
        </a-collapse-panel>
      </a-collapse>
    </template>
  </faq-view>
</template>

<style scoped></style>
