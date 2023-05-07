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
let activeTabIndex = ref(0)



getCookies()
function getCookies() {
    let type = localStorage.getItem("accountType")
    let id = localStorage.getItem("accountId")
    if (type == null || id == null) {
        window.location.href = '/'
    } else {
        accountId.value = +id
        accountType.value = type
        fetchData()
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


let vehicleDetails = ref(Array())
async function loadVehicles() {

    isProgressHidden.value = false
    let names = await Api.getVehicleDetails()
    isProgressHidden.value = true

    if (names.isSuccess == true) {
        vehicleDetails.value = Array()
        for (let index = 0; index < names.data.length; index++) {
            vehicleDetails.value.push(names.data[index])
        }

        if (vehicleDetails.value.length > 0) {
            vehicleName.value = vehicleDetails.value[0].name
        }
    } else {
        message.value.show(names.error)
    }
}



function fetchData() {
    if (accountId.value == 0) return
    // fetch data
    console.log("fetching...")
    if (activeTabIndex.value == 0) {
        loadAccountDetail()
        loadCustomerAllBooking(accountId.value)

    } else if (activeTabIndex.value == 1) {
        // Todo do something
        loadVehicles()
    }
}

let detailAccountId = ref(0)
let detailFullName = ref("loading...")
let detailEmail = ref("loading...")
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


function changeTab(index: number) {
    activeTabIndex.value = index
    fetchData()
}




let pickDateTime = ref("")
let dropDateTime = ref("")
let pickLocation = ref("")
let dropLocation = ref("")
let vehicleName = ref("")
let bookingType = ref("group")

let totalDistance = ref(0)
let totalPrice = ref(0)


function calculateDistance(){
    if(dropLocation.value != "" && pickLocation.value != ""){
        totalDistance.value = Math.round(Math.random() * 20 + 1)    // setting rand distance
        calculatePrice()
    } 
}


function calculatePrice() {
    
    for (let index = 0; index < vehicleDetails.value.length; index++) {
        const element = vehicleDetails.value[index];

        if (element.name == vehicleName.value) {
            if(bookingType.value == "group"){

                // give 30% discount on grouping
                totalPrice.value = Math.round(element.rate * 0.7) * totalDistance.value
            }else{
                totalPrice.value = element.rate * totalDistance.value
            }
            
            break
        }
    }
}


async function trySearchAndRegister() {
    isProgressHidden.value = false
    let mode = "search-register"
    let pickTime = new Date(pickDateTime.value).getTime()
    let dropTime = new Date(dropDateTime.value).getTime()
    let bookResult = await Api.bookCab(mode, accountId.value, 0, pickTime, dropTime, pickLocation.value, dropLocation.value, vehicleName.value, totalPrice.value, "group")
    isProgressHidden.value = true
    if (bookResult.isSuccess == true) {
        message.value.show("successful")
    } else {
        message.value.show(bookResult.error)
    }
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

    <div class="container">
        <ul class="nav nav-pills mb-3" id="pills-tab">
            <li class="nav-item">
                <button class="nav-link" :class="{ active: activeTabIndex == 0 }" @click="changeTab(0)">Cab Status</button>
            </li>
            <li class="nav-item">
                <button class="nav-link" :class="{ active: activeTabIndex == 1 }" @click="changeTab(1)">Register
                    Cab</button>
            </li>
        </ul>
    </div>
    <div class="tab-content" id="pills-tabContent">

        <!-- Cab history -->
        <div class="tab-pane fade" :class="{ show: activeTabIndex == 0, active: activeTabIndex == 0 }">

            <!-- account detail -->

            <div class="card mb-4 card-parent">
                <div class="card-body">
                    <h5>Customer Detail</h5>
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

        </div>

        <!-- Register cab -->
        <div class="tab-pane fade" :class="{ show: activeTabIndex == 1, active: activeTabIndex == 1 }">
            <div class="row">
                <div class="col-sm-6 cus-left">
                    <form @submit.prevent="trySearchAndRegister()">
                        <div class="mb-3">
                            <label for="pickTime" class="form-label">Enter Pick Time</label>
                            <input type="datetime-local" v-model="pickDateTime" class="form-control" id="pickTime"
                                placeholder="Pickup time" required>
                        </div>
                        <div class="mb-3">
                            <label for="dropTime" class="form-label">Enter Drop Time</label>
                            <input type="datetime-local" v-model="dropDateTime" class="form-control" id="dropTime"
                                placeholder="Drop time" required>
                        </div>

                        <div class="mb-3" style="margin-top: 40px;">
                            <label for="startLocation" class="form-label">Enter Pickup Location</label>
                            <input type="Text" @focusout="calculateDistance" v-model="pickLocation" class="form-control" id="pickLocation"
                                placeholder="India, Bihar, Patna" required>
                        </div>
                        <div class="mb-3">
                            <label for="dropLocation" class="form-label">Enter Drop Location</label>
                            <input type="Text" @focusout="calculateDistance" v-model="dropLocation" class="form-control" id="dropLocation"
                                placeholder="India, Bihar, Hajipur" required>
                        </div>

                        <label>Choose a vehicle:</label>
                        <select class="form-select" @change="calculatePrice" v-model="vehicleName"
                            aria-label="Default select example" required>
                            <option v-for="detail in vehicleDetails" :value="detail.name">{{ detail.name }}</option>
                        </select>

                        <label style="margin-top: 16px;">Booking type:</label>
                        <select class="form-select" @change="calculatePrice" v-model="bookingType"
                            aria-label="Default select example" required>
                            <option value="group" selected>Group</option>
                            <option value="single">Single</option>
                        </select>

                        <p style="margin-top: 20px;">Get 30% discount on grouping</p>
                        <div class="row">
                            <div class="col">
                                <h5>Distance: {{ totalDistance }} km</h5>
                            </div>
                            <div class="col">
                                <h5>Total Amount: ₹{{ totalPrice }}</h5>
                            </div>
                        </div>

                        <button type="submit" class="btn btn-primary">Register Cab</button>
                    </form>
                </div>
                <div class="col-sm-6 cus-right">Right</div>
            </div>

            <!-- Search result -->
            <div class="search-result">
                <h3>Searching booking</h3>
                <div class="table-responsive">
                    <table class="table table-hover table-striped">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Vehicle ID</th>
                                <th scope="col">Driver ID</th>
                                <th scope="col">Start time</th>
                                <th scope="col">End time</th>
                                <th scope="col">Vehicle name</th>
                                <th scope="col">Seat left</th>
                                <th scope="col">Join</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- <tr v-for="plan, index in vehiclePlan">
                        <th scope="row">{{ index }}</th>
                        <td>{{ plan.vehicle_id }}</td>
                        <td>{{ plan.name }}</td>
                        <td>{{ plan.rate }}</td>
                        <td>{{ plan.seats }}</td>
                        <td><button @click="vehicle.edit(plan.vehicle_id, plan.name, plan.rate, plan.seats)"
                                class="btn btn-primary"><i class="material-icons">edit</i>Edit</button></td>
                        <td><Button class="btn btn-danger"
                                @click="deleteOperation('Do you really want to delete?', plan.vehicle_id)"><i
                                    class="material-icons">delete</i>Delete</Button></td>
                    </tr> -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>



    <ProfileDialogVue :profile="profile" />
    <MessageDialog :message="message" />
    <ProgressDialog v-if="!isProgressHidden" />
</template>
<style scoped>
.search-result {
    margin-top: 50px;
}

.search-result h3 {
    text-align: center;
    margin-bottom: 20px;
}

.card-parent {
    margin: 24px;
    max-width: 600px;
    width: 100%;
}

.card-parent .row {
    margin-bottom: 16px;
}

.card-body h5 {
    margin-bottom: 20px;
}

#pills-tab {
    margin-top: 30px;
}

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

form .row {
    margin-top: 24px;
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