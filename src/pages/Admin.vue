<script setup lang='ts'>
import ProfileDialogVue, { ProfileData } from '../components/ProfileDialog.vue';
import MessageDialog, { Message } from '../components/MessageDialog.vue';
import ProgressDialog from '../components/ProgressDialog.vue';
import { ref } from 'vue';
import Api from '../api';
import VehicleDialogVue, { VehicleData } from '../components/VehicleDialog.vue';
import WarningDialogVue, { WarningData } from '../components/WarningDialog.vue';


let activeTabIndex = ref(0)
let message = ref(new Message())
let isProgressHidden = ref(true)

let accountId = ref(0)
let accountType = ref("")

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

const vehicleData = new (class extends VehicleData {

    create(): void {
        super.create()
    }

    edit(vehicleId: number, type:string, rate: number, seats: number): void {
        super.edit(vehicleId, type, rate, seats)
    }

    reloadData(): void {
        fetchData()
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

let vehicle = ref(vehicleData)


const warningData = new (class extends WarningData{
    onOk(): void {
        // do delete operation
        deleteData()
        this.hide()
    }

    show(message: string): void {
        super.show(message)
    }

})

let warning = ref(warningData)




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


function changeTab(index: number) {
    activeTabIndex.value = index
    fetchData()
}


function showProfile() {
    profile.value.show()
}



let vehiclePlan = ref(Array())
async function loadVehiclePlans() {
    isProgressHidden.value = false
    let accounts = await Api.getAllPlans()
    isProgressHidden.value = true
    if (accounts.isSuccess == true) {
        vehiclePlan.value = accounts.data
    } else {
        message.value.show(accounts.error)
    }
}

let customerAccounts = ref(Array())
async function loadCustomerAccounts(accountId: number) {
    isProgressHidden.value = false
    let accounts = await Api.getAllCustomerAccounts(accountId)
    isProgressHidden.value = true
    if (accounts.isSuccess == true) {
        customerAccounts.value = accounts.data
    } else {
        message.value.show(accounts.error)
    }
}

let driverAccounts = ref(Array())
async function loadDriverAccounts(accountId: number) {
    isProgressHidden.value = false
    let accounts = await Api.getAllDriverAccounts(accountId)
    isProgressHidden.value = true
    if (accounts.isSuccess == true) {
        driverAccounts.value = accounts.data
    } else {
        message.value.show(accounts.error)
    }
}

let bookingList = ref(Array())
async function loadBookingList(accountId: number) {
    isProgressHidden.value = false
    let accounts = await Api.getAllBookingList(accountId)
    isProgressHidden.value = true
    if (accounts.isSuccess == true) {
        bookingList.value = accounts.data
    } else {
        message.value.show(accounts.error)
    }
}


function fetchData() {
    // fetch data
    console.log("fetching...")
    if (activeTabIndex.value == 0) {
        loadVehiclePlans()
    } else if (activeTabIndex.value == 1) {
        loadCustomerAccounts(accountId.value)
    } else if (activeTabIndex.value == 2) {
        loadDriverAccounts(accountId.value)
    } else if (activeTabIndex.value == 3) {
        loadBookingList(accountId.value)
    }
}

async function deleteData() {
    // fetch data
    console.log("deleting...")
    let tableName = null

    if (activeTabIndex.value == 0) {
        tableName = 'vehicles'
    } else if (activeTabIndex.value == 1) {
        tableName = 'customers'
    } else if (activeTabIndex.value == 2) {
        tableName = 'drivers'
    } else if (activeTabIndex.value == 3) {
        tableName = 'cab_books'
    }

    if(tableName == null) return

    isProgressHidden.value = false
    let result = await Api.deleteOperation(tableName, idToDelete)
    isProgressHidden.value = true
    if (result.isSuccess == true) {
        fetchData()
    } else {
        message.value.show(result.error)
    }
}


let idToDelete = 0
function deleteOperation(message: string, id: number){
    idToDelete = id
    warning.value.show(message)
}


</script>
<template>
    <nav class="navbar sticky-top navbar-light bg-light">
        <div class="container-fluid">
            <div class="navbar-header">
                <a class="navbar-brand">BookMyCab</a>
            </div>
            <button class="btn btn-primary" @click="showProfile">Profile</button>
            <button class="btn btn-danger" @click="logout">Log out</button>
        </div>
    </nav>

    <div class="container">
        <ul class="nav nav-pills mb-3" id="pills-tab">
            <li class="nav-item">
                <button class="nav-link" :class="{ active: activeTabIndex == 0 }" @click="changeTab(0)">Plans</button>
            </li>
            <li class="nav-item">
                <button class="nav-link" :class="{ active: activeTabIndex == 1 }" @click="changeTab(1)">Customers</button>
            </li>
            <li class="nav-item">
                <button class="nav-link" :class="{ active: activeTabIndex == 2 }" @click="changeTab(2)">Drivers</button>
            </li>
            <li class="nav-item">
                <button class="nav-link" :class="{ active: activeTabIndex == 3 }" @click="changeTab(3)">Booking</button>
            </li>
        </ul>
    </div>
    <div class="tab-content" id="pills-tabContent">

        <!-- Tariff Plans -->
        <div class="tab-pane fade" :class="{ show: activeTabIndex == 0, active: activeTabIndex == 0 }">

            <div class="table-container">
                <div class="container">
                    <h3>Vehicle Plans</h3>
                    <button id="add-plan" class="btn btn-success btn-block" @click="vehicle.create()">Add Plan</button>
                </div>

                <div class="table-responsive">
                    <table class="table table-hover table-striped">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Vehicle ID</th>
                                <th scope="col">Name</th>
                                <th scope="col">Rate/km</th>
                                <th scope="col">Seats</th>
                                <th scope="col">Edit</th>
                                <th scope="col">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="plan, index in vehiclePlan">
                                <th scope="row">{{ index }}</th>
                                <td>{{ plan.vehicle_id }}</td>
                                <td>{{ plan.name }}</td>
                                <td>{{ plan.rate }}</td>
                                <td>{{ plan.seats }}</td>
                                <td><button @click="vehicle.edit(plan.vehicle_id, plan.name, plan.rate, plan.seats)" class="btn btn-primary"><i class="material-icons">edit</i>Edit</button></td>
                                <td><Button class="btn btn-danger" @click="deleteOperation('Do you really want to delete?', plan.vehicle_id)"><i class="material-icons">delete</i>Delete</Button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Customer accounts -->
        <div class="tab-pane fade" :class="{ show: activeTabIndex == 1, active: activeTabIndex == 1 }">
            <div class="table-container">
                <h3>Customer Accounts</h3>
                <div class="table-responsive">
                    <table class="table table-hover table-striped">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Customer ID</th>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Number</th>
                                <th scope="col">Gender</th>
                                <th scope="col">Age</th>
                                <th scope="col">Premium</th>
                                <th scope="col">Delete</th>
                            </tr>
                        </thead>
                        <tbody>

                            <tr v-for="account, index in customerAccounts">
                                <th scope="row">{{ index }}</th>
                                <td>{{ account.account_id }}</td>
                                <td>{{ account.name }}</td>
                                <td>{{ account.email }}</td>
                                <td>{{ account.number }}</td>
                                <td>{{ account.gender }}</td>
                                <td>{{ account.age }}</td>
                                <td v-if="account.is_premium == 0">Paid</td>
                                <td v-else>Free</td>
                                <td><Button class="btn btn-danger" @click="deleteOperation('Do you really want to delete?', account.account_id)"><i class="material-icons">delete</i>Delete</Button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Driver accounts -->
        <div class="tab-pane fade" :class="{ show: activeTabIndex == 2, active: activeTabIndex == 2 }">
            <div class="table-container">
                <h3>Driver Accounts</h3>
                <div class="table-responsive">
                    <table class="table table-hover table-striped">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Driver ID</th>
                                <th scope="col">Vehicle ID</th>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Number</th>
                                <th scope="col">Gender</th>
                                <th scope="col">Age</th>
                                <th scope="col">Status</th>
                                <th scope="col">Delete</th>
                            </tr>
                        </thead>
                        <tbody>

                            <tr v-for="account, index in driverAccounts">
                                <th scope="row">{{ index }}</th>
                                <td>{{ account.account_id }}</td>
                                <td>{{ account.vehicle_id }}</td>
                                <td>{{ account.name }}</td>
                                <td>{{ account.email }}</td>
                                <td>{{ account.number }}</td>
                                <td>{{ account.gender }}</td>
                                <td>{{ account.age }}</td>
                                <td v-if="account.is_busy == 0">Free</td>
                                <td v-else>Busy</td>
                                <td><Button class="btn btn-danger" @click="deleteOperation('Do you really want to delete?', account.account_id)"><i class="material-icons">delete</i>Delete</Button></td>

                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>

        </div>

        <!-- Booking -->
        <!-- cab_books - book_id, cus_id, driver_id, pick_time, drop_time, pick_loc, drop_loc -->
        <div class="tab-pane fade" :class="{ show: activeTabIndex == 3, active: activeTabIndex == 3 }">
            <div class="table-container">
                <h3>Cab Booking</h3>
                <div class="table-responsive">
                    <table class="table table-hover table-striped">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Booking ID</th>
                                <th scope="col">Customer ID</th>
                                <th scope="col">Driver ID</th>
                                <th scope="col">Pick Time</th>
                                <th scope="col">Pick Loc</th>
                                <th scope="col">Drop Loc</th>
                                <th scope="col">Book Mode</th>
                                <th scope="col">Amount</th>
                                <th scope="col">Status</th>
                                <th scope="col">Delete</th>
                            </tr>
                        </thead>
                        <tbody>

                            <tr v-for="book, index in bookingList">
                                <th scope="row">{{ index }}</th>
                                <td>{{ book.book_id }}</td>
                                <td>{{ book.cus_id }}</td>
                                <td>{{ book.driver_id }}</td>
                                <td>{{ unixMillisecondsToDateString(book.pick_time) }}</td>
                                <td>{{ book.pick_loc }}</td>
                                <td>{{ book.drop_loc }}</td>
                                <td v-if="book.is_single == 0">Group</td>
                                <td v-else>Single</td>
                                <td>₹ {{ book.amount }}</td>
                                <td v-if="book.is_done == 0">Active</td>
                                <td v-else>Done</td>
                                <td><Button class="btn btn-danger" @click="deleteOperation('Do you really want to delete?', book.book_id)"><i class="material-icons">delete</i>Delete</Button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>


    <ProfileDialogVue :profile="profile" />
    <VehicleDialogVue :vehicle="vehicle" />
    <MessageDialog :message="message" />
    <WarningDialogVue :warning="warning" />
    <ProgressDialog v-if="!isProgressHidden" />
</template>
<style scoped>
#pills-tab {
    margin-top: 30px;
}

#add-plan {
    width: 100%;
    margin-bottom: 20px;

}

.table-container {
    margin-top: 50px;

}

.table-container h3 {
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

table button {
    display: flex;
    align-items: center;
}

table button i {
    font-size: 18px;
    margin-right: 8px;
}

table .table-active {
    background-color: #1f8bff !important;
    color: white !important;
}
</style>