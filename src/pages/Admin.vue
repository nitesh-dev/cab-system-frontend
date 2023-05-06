<script setup lang='ts'>
import ProfileDialogVue, {ProfileData} from '../components/ProfileDialog.vue';
import MessageDialog, { Message } from '../components/MessageDialog.vue';
import ProgressDialog from '../components/ProgressDialog.vue';
import { ref } from 'vue';


let profile = ref(new ProfileData())
let activeTabIndex = ref(1)
let message = ref(new Message())
let isProgressHidden = ref(true)

function logout() {
    localStorage.removeItem("accountType")
    localStorage.removeItem("accountId")
    window.location.href = '/'
}


function changeTab(index: number){
    activeTabIndex.value = index
}


function showProfile(){
    profile.value.show()
}


function toggleProgress(isHidden: boolean) {
    isProgressHidden.value = isHidden
    
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
        <div class="tab-pane fade" :class="{show: activeTabIndex == 0, active: activeTabIndex == 0}">

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
                                <th scope="col">Edit</th>
                                <th scope="col">Delete</th>
                            </tr>
                        </thead>
                        <tbody>

                            <tr>
                                <th scope="row">1</th>
                                <td>5845825822</td>
                                <td>Bike</td>
                                <td>30</td>
                                <td>1</td>
                                <td><button class="btn btn-primary"><i class="material-icons">edit</i>Edit</button></td>
                                <td><Button class="btn btn-danger"><i class="material-icons">delete</i>Delete</Button></td>
                            </tr>

                            <tr>
                                <th scope="row">2</th>
                                <td>5845825822</td>
                                <td>Alto</td>
                                <td>60</td>
                                <td>3</td>
                                <td><button class="btn btn-primary"><i class="material-icons">edit</i>Edit</button></td>
                                <td><Button class="btn btn-danger"><i class="material-icons">delete</i>Delete</Button></td>
                            </tr>

                            <tr>
                                <th scope="row">3</th>
                                <td>5845825822</td>
                                <td>Nano</td>
                                <td>50</td>
                                <td>2</td>
                                <td><button class="btn btn-primary"><i class="material-icons">edit</i>Edit</button></td>
                                <td><Button class="btn btn-danger"><i class="material-icons">delete</i>Delete</Button></td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="tab-pane fade" :class="{show: activeTabIndex == 1, active: activeTabIndex == 1}">
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
                                <th scope="col">Edit</th>
                                <th scope="col">Delete</th>
                            </tr>
                        </thead>
                        <tbody>

                            <tr>
                                <th scope="row">1</th>
                                <td>5845825822</td>
                                <td>Test Name</td>
                                <td>Test@gmail.com</td>
                                <td>5456893256</td>
                                <td><button class="btn btn-primary"><i class="material-icons">edit</i>Edit</button></td>
                                <td><Button class="btn btn-danger"><i class="material-icons">delete</i>Delete</Button></td>

                            </tr>

                            <tr>
                                <th scope="row">2</th>
                                <td>5845825822</td>
                                <td>Test Name</td>
                                <td>Test@gmail.com</td>
                                <td>5456893256</td>
                                <td><button class="btn btn-primary"><i class="material-icons">edit</i>Edit</button></td>
                                <td><Button class="btn btn-danger"><i class="material-icons">delete</i>Delete</Button></td>
                            </tr>
                            <tr>
                                <th scope="row">3</th>
                                <td>5845825822</td>
                                <td>Test Name</td>
                                <td>Test@gmail.com</td>
                                <td>5456893256</td>
                                <td><button class="btn btn-primary"><i class="material-icons">edit</i>Edit</button></td>
                                <td><Button class="btn btn-danger"><i class="material-icons">delete</i>Delete</Button></td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="tab-pane fade" :class="{show: activeTabIndex == 2, active: activeTabIndex == 2}">
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
                                <th scope="col">Edit</th>
                                <th scope="col">Delete</th>
                            </tr>
                        </thead>
                        <tbody>

                            <tr>
                                <th scope="row">1</th>
                                <td>5845825822</td>
                                <td>5845825822</td>
                                <td>Test Name</td>
                                <td>Test@gmail.com</td>
                                <td>5456893256</td>
                                <td><button class="btn btn-primary"><i class="material-icons">edit</i>Edit</button></td>
                                <td><Button class="btn btn-danger"><i class="material-icons">delete</i>Delete</Button></td>

                            </tr>

                            <tr>
                                <th scope="row">2</th>
                                <td>5845825822</td>
                                <td>5845825822</td>
                                <td>Test Name</td>
                                <td>Test@gmail.com</td>
                                <td>5456893256</td>
                                <td><button class="btn btn-primary"><i class="material-icons">edit</i>Edit</button></td>
                                <td><Button class="btn btn-danger"><i class="material-icons">delete</i>Delete</Button></td>
                            </tr>
                            <tr>
                                <th scope="row">3</th>
                                <td>5845825822</td>
                                <td>5845825822</td>
                                <td>Test Name</td>
                                <td>Test@gmail.com</td>
                                <td>5456893256</td>
                                <td><button class="btn btn-primary"><i class="material-icons">edit</i>Edit</button></td>
                                <td><Button class="btn btn-danger"><i class="material-icons">delete</i>Delete</Button></td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>

        </div>
        <div class="tab-pane fade" :class="{show: activeTabIndex == 3, active: activeTabIndex == 3}">
            <div class="table-container">
                <h3>Cab Booking</h3>
                <div class="table-responsive">
                    <table class="table table-hover table-striped">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Customer ID</th>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Phone</th>
                                <th scope="col">Edit</th>
                                <th scope="col">Delete</th>
                            </tr>
                        </thead>
                        <tbody>

                            <tr>
                                <th scope="row">1</th>
                                <td>5845825822</td>
                                <td>Test Name</td>
                                <td>Test@gmail.com</td>
                                <td>5456893256</td>
                                <td><button class="btn btn-primary"><i class="material-icons">edit</i>Edit</button></td>
                                <td><Button class="btn btn-danger"><i class="material-icons">delete</i>Delete</Button></td>

                            </tr>

                            <tr>
                                <th scope="row">2</th>
                                <td>5845825822</td>
                                <td>Test Name</td>
                                <td>Test@gmail.com</td>
                                <td>5456893256</td>
                                <td><button class="btn btn-primary"><i class="material-icons">edit</i>Edit</button></td>
                                <td><Button class="btn btn-danger"><i class="material-icons">delete</i>Delete</Button></td>
                            </tr>
                            <tr>
                                <th scope="row">3</th>
                                <td>5845825822</td>
                                <td>Test Name</td>
                                <td>Test@gmail.com</td>
                                <td>5456893256</td>
                                <td><button class="btn btn-primary"><i class="material-icons">edit</i>Edit</button></td>
                                <td><Button class="btn btn-danger"><i class="material-icons">delete</i>Delete</Button></td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>


    <ProfileDialogVue @on-toggle-progress="toggleProgress" :profile="profile" />
    <MessageDialog  :message="message" />
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