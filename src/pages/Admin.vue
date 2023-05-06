<script setup lang='ts'>
import ProfileDialogVue, { ProfileData } from '../components/ProfileDialog.vue';
import MessageDialog, { Message } from '../components/MessageDialog.vue';
import ProgressDialog from '../components/ProgressDialog.vue';
import { ref } from 'vue';
import Api from '../api';


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


function changeTab(index: number) {
    activeTabIndex.value = index
    fetchData()
}


function showProfile() {
    profile.value.show()
}


function toggleProgress(isHidden: boolean) {
    isProgressHidden.value = isHidden

}


let tariffPlans = ref(Array())
async function loadTariffPlans() {
    isProgressHidden.value = false
    let accounts = await Api.getAllPlans()
    isProgressHidden.value = true
    if (accounts.isSuccess == true) {
        tariffPlans.value = accounts.data
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
        loadTariffPlans()
    } else if (activeTabIndex.value == 1) {
        loadCustomerAccounts(accountId.value)
    } else if (activeTabIndex.value == 2) {
        loadDriverAccounts(accountId.value)
    } else if (activeTabIndex.value == 3) {
        loadBookingList(accountId.value)
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
                    <h3>Tarif Plans</h3>
                    <button id="add-plan" class="btn btn-success btn-block">Add Plan</button>
                </div>

                <div class="table-responsive">
                    <table class="table table-hover table-striped">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Tarif ID</th>
                                <th scope="col">Type</th>
                                <th scope="col">Rate/km</th>
                                <th scope="col">Seats</th>
                                <!-- <th scope="col">Edit</th> -->
                                <th scope="col">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="plan, index in tariffPlans">
                                <th scope="row">{{ index }}</th>
                                <td>{{ plan.tarif_id }}</td>
                                <td>{{ plan.type }}</td>
                                <td>{{ plan.rate }}</td>
                                <td>{{ plan.seats }}</td>
                                <!-- <td><button class="btn btn-primary"><i class="material-icons">edit</i>Edit</button></td> -->
                                <td><Button class="btn btn-danger"><i class="material-icons">delete</i>Delete</Button></td>
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
                                <th scope="col">Phone</th>
                                <th scope="col">Delete</th>
                            </tr>
                        </thead>
                        <tbody>

                            <tr v-for="account, index in customerAccounts">
                                <th scope="row">{{ index }}</th>
                                <td>{{ account.account_id }}</td>
                                <td>{{ account.name }}</td>
                                <td>{{ account.email }}</td>
                                <td>{{ account.phone }}</td>
                                <td><Button class="btn btn-danger"><i class="material-icons">delete</i>Delete</Button></td>
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
                                <th scope="col">Phone</th>
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
                                <td>{{ account.phone }}</td>
                                <td><Button class="btn btn-danger"><i class="material-icons">delete</i>Delete</Button></td>

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
                                <th scope="col">Drop Time</th>
                                <th scope="col">Pick Loc</th>
                                <th scope="col">Drop Loc</th>
                                <th scope="col">Delete</th>
                            </tr>
                        </thead>
                        <tbody>

                            <tr v-for="book, index in bookingList">
                                <th scope="row">{{ index }}</th>
                                <td>{{ book.book_id }}</td>
                                <td>{{ book.cus_id }}</td>
                                <td>{{ book.driver_id }}</td>
                                <td>{{ book.pick_time }}</td>
                                <td>{{ book.drop_time }}</td>
                                <td>{{ book.pick_loc }}</td>
                                <td>{{ book.drop_loc }}</td>
                                <td><Button class="btn btn-danger"><i class="material-icons">delete</i>Delete</Button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>


    <ProfileDialogVue @on-toggle-progress="toggleProgress" :profile="profile" />
    <MessageDialog :message="message" />
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