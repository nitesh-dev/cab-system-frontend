<script lang="ts">
export class DriverTask {
    activeTask = Array()
    registeredTask = Array()
    historyTask = Array()
}

</script>


<script setup lang='ts'>
import ProfileDialogVue, { ProfileData } from '../components/ProfileDialog.vue';
import MessageDialog, { Message } from '../components/MessageDialog.vue';
import ProgressDialog from '../components/ProgressDialog.vue';
import { ref } from 'vue';
import Api from '../api';


let message = ref(new Message())
let isProgressHidden = ref(true)

let accountId = ref(0)
let accountType = ref("")



getCookies()
function getCookies() {
    let type = localStorage.getItem("accountType")
    let id = localStorage.getItem("accountId")
    if (type == null || id == null) {
        window.location.href = '/'
    } else {
        accountId.value = +id
        accountType.value = type
    }
}

function logout() {
    localStorage.removeItem("accountType")
    localStorage.removeItem("accountId")
    window.location.href = '/'
}


let driverAllTask = ref(new DriverTask())
async function loadDriverTaskList(accountId: number) {
    isProgressHidden.value = false
    let tasks = await Api.getDriverAllTaskList(accountId)
    isProgressHidden.value = true

    let currentDateTime = new Date().getTime()
    if (tasks.isSuccess == true) {
        for (let index = 0; index < tasks.data.length; index++) {
            let task = tasks.data[index]
            let startTime = task.pick_time
            let endTime = task.drop_time
            if (currentDateTime >= startTime && currentDateTime <= endTime) {
                driverAllTask.value.activeTask.push(task)
            } else if (currentDateTime < startTime && currentDateTime < endTime) {
                driverAllTask.value.registeredTask.push(task)
            } else {
                driverAllTask.value.historyTask.push(task)
            }
        }
    } else {
        message.value.show(tasks.error)
    }
}



let detailAccountId = ref(0)
let detailFullName = ref("")
let detailEmail = ref("")
let detailNumber = ref(0)

async function loadAccountDetail() {
    const res = await Api.getAccountDetail(accountId.value, accountType.value)
    if (res.isSuccess) {
        detailAccountId.value = res.data.account_id
        detailFullName.value = res.data.name
        detailEmail.value = res.data.email
        detailNumber.value = res.data.number
    }
}




const profileData = new (class extends ProfileData {
    show() {
        isProgressHidden.value = false
        super.show()
    }
    hide(): void {
        super.hide()
        isProgressHidden.value = true
    }

    hideProgress(): void {
        isProgressHidden.value = true
    }

    showProgress(): void {
        isProgressHidden.value = false
    }

    showMessage(text: string): void {
        message.value.show(text)
    }

    onUpdateSuccessFul(): void {
        detailFullName.value = this.name
        detailEmail.value = this.email
        detailNumber.value = this.number
    }
})

let profile = ref(profileData)

function showProfile() {
    profile.value.show()
}




fetchData()

function fetchData() {
    if (accountId.value == 0) return
    // fetch data
    console.log("fetching...")
    loadDriverTaskList(accountId.value)
    loadAccountDetail()

}


function unixMillisecondsToDateString(unixMilliseconds: number) {
    // Create a new Date object with the Unix timestamp in milliseconds
    const date = new Date(unixMilliseconds);

    // Extract the day, month, and year from the date object
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();

    // Extract the hours and minutes from the date object
    let hours = date.getHours();
    let minutes: any = date.getMinutes();

    // Convert the hours to 12-hour format and determine whether it's AM or PM
    let amOrPm = 'AM';
    if (hours >= 12) {
        amOrPm = 'PM';
        hours -= 12;
    }
    if (hours === 0) {
        hours = 12;
    }

    // Add leading zeros to the minutes if needed
    if (minutes < 10) {
        minutes = '0' + minutes;
    }

    // Construct the date string in the desired format
    const dateString = `${day} ${month} ${year}, ${hours}:${minutes} ${amOrPm}`;

    return dateString;
}

</script>
<template>
    <nav class="navbar sticky-top navbar-light bg-light">
        <div class="container-fluid">
            <div class="navbar-header">
                <a class="navbar-brand">BookMyCab</a>
            </div>
            <button class="btn btn-primary" @click="showProfile">Profile</button>
            <button class="btn btn-danger" type="submit" @click="logout">Log out</button>
        </div>
    </nav>


    <!-- account detail -->

    <div class="card mb-4 card-parent">
        <div class="card-body">
            <h5>Driver Detail</h5>
            <div class="row">
                <div class="col-sm-3">
                    <p class="mb-0">Account ID</p>
                </div>
                <div class="col-sm-9">
                    <p class="text-muted mb-0">{{ detailAccountId }}</p>
                </div>
            </div>

            <div class="row">
                <div class="col-sm-3">
                    <p class="mb-0">Full Name</p>
                </div>
                <div class="col-sm-9">
                    <p class="text-muted mb-0">{{ detailFullName }}</p>
                </div>
            </div>

            <div class="row">
                <div class="col-sm-3">
                    <p class="mb-0">Email</p>
                </div>
                <div class="col-sm-9">
                    <p class="text-muted mb-0">{{ detailEmail }}</p>
                </div>
            </div>

            <div class="row">
                <div class="col-sm-3">
                    <p class="mb-0">Number</p>
                </div>
                <div class="col-sm-9">
                    <p class="text-muted mb-0">{{ detailNumber }}</p>
                </div>
            </div>
            
        </div>
    </div>

    <div class="cab-history">
        <h3>Driver Task History</h3>
        <div class="table-responsive">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Booking ID</th>
                        <th scope="col">Customer ID</th>
                        <th scope="col">Pick Time</th>
                        <th scope="col">Drop Time</th>
                        <th scope="col">Pick Loc</th>
                        <th scope="col">Drop Loc</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="blank_row">
                        <th colspan="8">Active</th>
                    </tr>
                    <tr class="table-active" v-for="task, index in driverAllTask.activeTask">
                        <th scope="row">{{ index }}</th>
                        <td>{{ task.book_id }}</td>
                        <td>{{ task.cus_id }}</td>
                        <td>{{ unixMillisecondsToDateString(task.pick_time) }}</td>
                        <td>{{ unixMillisecondsToDateString(task.drop_time) }}</td>
                        <td>{{ task.drop_loc }}</td>
                        <td>{{ task.pick_loc }}</td>
                    </tr>
                    <tr class="blank_row">
                        <th colspan="8">Registered Task</th>
                    </tr>
                    <tr v-for="task, index in driverAllTask.registeredTask">
                        <th scope="row">{{ index }}</th>
                        <td>{{ task.book_id }}</td>
                        <td>{{ task.cus_id }}</td>
                        <td>{{ unixMillisecondsToDateString(task.pick_time) }}</td>
                        <td>{{ unixMillisecondsToDateString(task.drop_time) }}</td>
                        <td>{{ task.drop_loc }}</td>
                        <td>{{ task.pick_loc }}</td>
                    </tr>


                    <tr class="blank_row">
                        <th colspan="8">History</th>
                    </tr>

                    <tr v-for="task, index in driverAllTask.historyTask">
                        <th scope="row">{{ index }}</th>
                        <td>{{ task.book_id }}</td>
                        <td>{{ task.cus_id }}</td>
                        <td>{{ unixMillisecondsToDateString(task.pick_time) }}</td>
                        <td>{{ unixMillisecondsToDateString(task.drop_time) }}</td>
                        <td>{{ task.drop_loc }}</td>
                        <td>{{ task.pick_loc }}</td>
                    </tr>


                </tbody>
            </table>
        </div>
    </div>


    <ProfileDialogVue :profile="profile" />
    <MessageDialog :message="message" />
    <ProgressDialog v-if="!isProgressHidden" />
</template>
<style scoped>

.card-parent{
    margin: 24px;
    max-width: 600px;
    width: 100%;
}

.card-parent .row{
    margin-bottom: 16px;
}

.card-body h5{
    margin-bottom: 20px;
}
.cab-history {
    margin-top: 50px;

}

.cab-history h3 {
    text-align: center;
    margin-bottom: 30px;
}


.blank_row {
    background-color: #FFFFFF;
}


.blank_row th {
    padding-top: 40px;
    text-align: center !important;
}

table td,
table th {
    white-space: nowrap;
    padding: 16px 12px;
}

table .table-active {
    background-color: #1f8bff !important;
    color: white !important;
}
</style>