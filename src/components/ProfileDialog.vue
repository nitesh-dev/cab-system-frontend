<script lang="ts">
export class ProfileData {
    isHidden = true
    isEditable = false
    show() {
        this.isHidden = false
        this.isEditable = false
    }
    hide() {
        this.isHidden = true
    }
}

</script>


<script setup lang='ts'>
import Api from '../api'
import { ref, onMounted } from 'vue';

let prop = defineProps<{
    profile: ProfileData
}>()

const emit = defineEmits<{
    (e: 'onToggleProgress', isHidden: boolean): void
}>()



let name = ref("")
let number = ref<number>()
let email = ref("")
let password = ref("")



async function onSubmitForm() {
    emit('onToggleProgress', false)

}

function goUpdateMode() {
    prop.profile.isEditable = true
}


async function loadAccountData() {
    emit('onToggleProgress', false)
    let accountType = localStorage.getItem("accountType") as string
    let accountId: number = +(localStorage.getItem("accountId") as string)
    const res = await Api.getAccountDetail(accountId, accountType)
    emit('onToggleProgress', true)
    if (res.isSuccess) {

        
    } else {
        alert(res.error)
        prop.profile.hide()
    }
}





</script>
<template>
    <div id="message-model" v-if="!profile.isHidden" class="modal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="cus-container text-center">
                    <form class="form-profile" @submit.prevent="onSubmitForm">

                        <h1 class="h3 mb-3 font-weight-normal">Profile</h1>
                        <input type="text" v-model="name" class="form-control" placeholder="Name" required="true"
                            :readonly="!profile.isEditable">
                        <input type="number" v-model="number" class="form-control" placeholder="Number" required="true"
                            :readonly="!profile.isEditable">
                        <input type="email" v-model="email" class="form-control" placeholder="Email address" required="true" readonly>
                        <input type="password" v-model="password" id="inputPassword" class="form-control" placeholder="Password"
                            required="true" :readonly="!profile.isEditable">

                        <div class="row">
                            <div class="col">
                                <button class="btn btn-lg btn-secondary btn-block" @click="profile.hide()">Close</button>
                            </div>
                            <div class="col">
                                <button class="btn btn-lg btn-primary btn-block" v-if="profile.isEditable"
                                    type="submit">Update
                                    Profile</button>
                                <button class="btn btn-lg btn-primary btn-block" @click="goUpdateMode" v-else>Edit
                                    Profile</button>

                            </div>
                        </div>


                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
#message-model {
    display: block;
    background-color: rgba(0, 0, 0, 0.116);
}

.form-profile {
    max-width: 400px;
    width: 100%;
}

.cus-container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 30px;
    padding-bottom: 30px;

}

button {
    width: 100%;
}

input[type=checkbox] {
    margin-top: 30px;
}

form>input {
    margin-top: 10px;
    padding: 12px;
}

#inputPassword {
    margin-bottom: 20px;
}
</style>