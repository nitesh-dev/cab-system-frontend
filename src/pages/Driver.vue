<script setup lang='ts'>
import ProfileDialogVue from '../components/ProfileDialog.vue';
import MessageDialog, { Message } from '../components/MessageDialog.vue';
import ProgressDialog from '../components/ProgressDialog.vue';
import { ref } from 'vue';


let message = ref(new Message())
let isProgressHidden = ref(true)

function logout(){
    localStorage.removeItem("accountType")
    localStorage.removeItem("accountId")
    window.location.href = '/'
}

</script>
<template>
    <nav class="navbar sticky-top navbar-light bg-light">
        <div class="container-fluid">
            <div class="navbar-header">
                <a class="navbar-brand">BookMyCab</a>
            </div>
            <ul class="nav nav-pills">

                <li class="nav-item">
                    <a class="nav-link active" href="#">Profile</a>
                </li>

            </ul>
            <button class="btn btn-danger" type="submit" @click="logout">Log out</button>
        </div>
    </nav>

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
                    <tr class="table-active">
                        <th scope="row">1</th>
                        <td>5845825822</td>
                        <td>5852258525</td>
                        <td>12 dec 2023, 10:30 AM</td>
                        <td>12 dec 2023, 11:30 AM</td>
                        <td>India, Bihar, Patna</td>
                        <td>India, Bihar, Hajipur</td>
                    </tr>
                    <tr class="blank_row">
                        <th colspan="8">Registered Task</th>
                    </tr>
                    <tr>
                        <th scope="row">1</th>
                        <td>5845825822</td>
                        <td>5852258525</td>
                        <td>12 dec 2023, 10:30 AM</td>
                        <td>12 dec 2023, 11:30 AM</td>
                        <td>India, Bihar, Patna</td>
                        <td>India, Bihar, Hajipur</td>
                    </tr>
                    <tr>
                        <th scope="row">2</th>
                        <td>5845825822</td>
                        <td>5852258525</td>
                        <td>12 dec 2023, 10:30 AM</td>
                        <td>12 dec 2023, 11:30 AM</td>
                        <td>India, Bihar, Patna</td>
                        <td>India, Bihar, Hajipur</td>
                    </tr>

                    <tr class="blank_row">
                        <th colspan="8">History</th>
                    </tr>

                    <tr>
                        <th scope="row">1</th>
                        <td>5845825822</td>
                        <td>5852258525</td>
                        <td>12 dec 2023, 10:30 AM</td>
                        <td>12 dec 2023, 11:30 AM</td>
                        <td>India, Bihar, Patna</td>
                        <td>India, Bihar, Hajipur</td>
                    </tr>
                    <tr>
                        <th scope="row">2</th>
                        <td>5845825822</td>
                        <td>5852258525</td>
                        <td>12 dec 2023, 10:30 AM</td>
                        <td>12 dec 2023, 11:30 AM</td>
                        <td>India, Bihar, Patna</td>
                        <td>India, Bihar, Hajipur</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>


    <!-- <ProfileDialogVue hidden /> -->
    <MessageDialog  :message="message"/>
    <ProgressDialog v-if="!isProgressHidden"/>
</template>
<style scoped>
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