<script lang="ts">
export class CustomerBooking {
    activeBook = Array()
    registeredBook = Array()
    historyBook = Array()
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
})

let profile = ref(profileData)

function showProfile() {
    profile.value.show()
}



let customerAllBooking = ref(new CustomerBooking())
async function loadCustomerAllBooking(accountId: number) {
    isProgressHidden.value = false
    let booking = await Api.getDriverAllTaskList(accountId)
    isProgressHidden.value = true

    let currentDateTime = new Date().getTime()
    if (booking.isSuccess == true) {
        
        for (let index = 0; index < booking.data.length; index++) {
            let task = booking.data[index]
            let startTime = task.pick_time
            let endTime = task.drop_time

            if (currentDateTime >= startTime && currentDateTime <= endTime) {
                customerAllBooking.value.activeBook.push(task)
            } else if (currentDateTime < startTime && currentDateTime < endTime) {
                customerAllBooking.value.registeredBook.push(task)
            } else {
                customerAllBooking.value.historyBook.push(task)
            }
        }
    } else {
        message.value.show(booking.error)
    }
}




fetchData()

function fetchData() {
    if (accountId.value == 0) return
    // fetch data
    console.log("fetching...")
    loadCustomerAllBooking(accountId.value)

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
    <div class="row">
        <div class="col-sm-6 cus-left">
            <form>
                <div class="mb-3">
                    <label for="pickTime" class="form-label">Enter Pick Time</label>
                    <input type="datetime-local" class="form-control" id="pickTime" placeholder="Pickup time">
                </div>
                <div class="mb-3">
                    <label for="dropTime" class="form-label">Enter Drop Time</label>
                    <input type="datetime-local" class="form-control" id="dropTime" placeholder="Drop time">
                </div>

                <div class="mb-3" style="margin-top: 40px;">
                    <label for="startLocation" class="form-label">Enter Pickup Location</label>
                    <input type="Text" class="form-control" id="pickLocation" placeholder="India, Bihar, Patna">
                </div>
                <div class="mb-3">
                    <label for="dropLocation" class="form-label">Enter Drop Location</label>
                    <input type="Text" class="form-control" id="dropLocation" placeholder="India, Bihar, Hajipur">
                </div>

                <label for="cars">Choose a vehicle:</label>
                <select class="form-select" aria-label="Default select example">
                    <option selected value="0">Bike</option>
                    <option value="1">Micro</option>
                    <option value="2">Alto</option>
                    <option value="3">Prime suv</option>
                </select>

                <button type="submit" class="btn btn-primary">Find Cab</button>
            </form>
        </div>
        <div class="col-sm-6 cus-right">Right</div>
    </div>

    <div class="cab-history">
        <h3>Cab Status</h3>
        <div class="table-responsive">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Booking ID</th>
                        <th scope="col">Driver ID</th>
                        <th scope="col">Pick Time</th>
                        <th scope="col">Drop Time</th>
                        <th scope="col">Pick Loc</th>
                        <th scope="col">Drop Loc</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="blank_row">
                        <th colspan="7">Active</th>
                    </tr>
                    <tr class="table-active" v-for="task, index in customerAllBooking.activeBook">
                        <th scope="row">{{ index + 1 }}</th>
                        <td>{{ task.book_id }}</td>
                        <td>{{ task.driver_id }}</td>
                        <td>{{ unixMillisecondsToDateString(task.pick_time) }}</td>
                        <td>{{ unixMillisecondsToDateString(task.drop_time) }}</td>
                        <td>{{ task.drop_loc }}</td>
                        <td>{{ task.pick_loc }}</td>
                    </tr>

                    <tr class="blank_row">
                        <th colspan="7">Registered Task</th>
                    </tr>
                    <tr v-for="task, index in customerAllBooking.registeredBook">
                        <th scope="row">{{ index + 1 }}</th>
                        <td>{{ task.book_id }}</td>
                        <td>{{ task.driver_id }}</td>
                        <td>{{ unixMillisecondsToDateString(task.pick_time) }}</td>
                        <td>{{ unixMillisecondsToDateString(task.drop_time) }}</td>
                        <td>{{ task.drop_loc }}</td>
                        <td>{{ task.pick_loc }}</td>
                    </tr>

                    <tr class="blank_row">
                        <th colspan="7">History</th>
                    </tr>
                    <tr v-for="task, index in customerAllBooking.historyBook">
                        <th scope="row">{{ index + 1 }}</th>
                        <td>{{ task.book_id }}</td>
                        <td>{{ task.driver_id }}</td>
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
.row {
    width: 100%;
    justify-content: center;
}

.cus-left {
    padding: 30px;
    padding-right: 10px;
    max-width: 600px;
}

form>select {
    margin-top: 10px;
}

form>button {
    margin-top: 20px;
    display: block;
    width: 100%;
}

.cus-right {
    padding: 0;
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