<script setup lang='ts'>
import MessageDialog, { Message } from '../components/MessageDialog.vue';
import ProgressDialog from '../components/ProgressDialog.vue';
import Api from '../api'
import { ref } from 'vue';

let name = ref<string>("")
let number = ref<number>()
let email = ref<string>("")
let password = ref<string>("")
let accountType = ref<string>("customer")
let gender = ref("Male")
let age = ref<number>()

let message = ref(new Message())
let isProgressHidden = ref(true)


function saveCookies(accountType: string, accountId: number) {
  localStorage.setItem("accountType", accountType)
  localStorage.setItem("accountId", accountId.toString())
}

async function onSubmitForm() {

  isProgressHidden.value = false
  const res = await Api.signUp(name.value, (number.value as number).toString(), email.value, password.value, gender.value, age.value as number, accountType.value)
  isProgressHidden.value = true
  if (res.isSuccess) {
    saveCookies(res.accountType, res.accountId)
    window.location.href = '/'
  } else {
    message.value.show(res.error as string)
  }

}


</script>
<template>
  <div class="cus-container text-center">
    <form class="form-signup" @submit.prevent="onSubmitForm">

      <h1 class="h3 mb-3 font-weight-normal">Sign Up</h1>
      <input type="text" v-model="name" class="form-control" placeholder="Name" required="true">
      <input type="number" v-model="number" class="form-control" placeholder="Number" required="true">
      <input type="email" v-model="email" class="form-control" placeholder="Email address" required="true">
      <input type="password" v-model="password" id="inputPassword" class="form-control" placeholder="Password"
        required="true">

      <input type="number" v-model="age" class="form-control" placeholder="Age" required="true">

      <select class="form-select" v-model="gender" aria-label="Default select example" style="margin-bottom: 20px;" required>
        <option value="Male" selected>Male</option>
        <option value="Female">Female</option>
      </select>

      <div class="form-check form-check-inline">
        <input class="form-check-input" v-model="accountType" type="radio" name="accountType" checked="true" id="customer"
          value="customer">
        <label class="form-check-label" for="customer">Customer</label>
      </div>

      <div class="form-check form-check-inline">
        <input class="form-check-input" v-model="accountType" type="radio" name="accountType" id="driver" value="driver">
        <label class="form-check-label" for="driver">Driver</label>
      </div>

      <button class="btn btn-lg btn-primary btn-block" type="submit">Sign Up</button>
      <p>Already have a account? <a href="/sign-in">Sign In</a></p>
    </form>
  </div>
  <MessageDialog :message="message" />
  <ProgressDialog v-if="!isProgressHidden" />
</template>
<style scoped>
.form-signup {
  max-width: 400px;
  width: 100%;
}

.cus-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

button {
  width: 100%;
  margin-top: 20px;
}

p {
  margin-top: 30px;
}

input[type=checkbox], select {
  margin-top: 30px;
}

form>input, form>select {
  margin-top: 10px;
  padding: 12px;
}

#inputPassword {
  margin-bottom: 20px;
}
</style>