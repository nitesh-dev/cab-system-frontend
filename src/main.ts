
import { createApp } from 'vue'
import './style.css';
import './bootstrap.css'
import App from './App.vue';
import NotFoundVue from "./pages/NotFound.vue";
import HomeVue from "./pages/Home.vue";
import SignInVue from "./pages/SignIn.vue";
import SignUpVue from "./pages/SignUp.vue";
import CustomerVue from "./pages/Customer.vue";
import DriverVue from "./pages/Driver.vue";
import AdminVue from "./pages/Admin.vue";
import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(),
  routes: []
})

router.addRoute({
  path: "/", name: "root", component: HomeVue, meta: {
    title: "Home"
  }
})

router.addRoute({
  path: "/sign-in", component: SignInVue, meta: {
    title: "Sign In"
  }
})

router.addRoute({
  path: "/sign-up", component: SignUpVue, meta: {
    title: "Sign Up"
  }
})

router.addRoute({
  path: "/customer", component: CustomerVue, meta: {
    title: "Customer"
  }
})

router.addRoute({
  path: "/driver", component: DriverVue, meta: {
    title: "Driver"
  }
})


router.addRoute({
  path: "/admin", component: AdminVue, meta: {
    title: "Admin"
  }
})



router.addRoute({
  path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundVue, meta: {
    title: "404 - Not Found"
  }
})

createApp(App).use(router).mount("#app")


router.beforeEach((to, _from, next) => {

  const title = to.meta.title as string
  if (title) {
    document.title = title
  }
  next()
})



