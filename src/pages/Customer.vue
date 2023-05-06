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

    <ProfileDialogVue hidden />
    <MessageDialog :message="message"/>
    <ProgressDialog v-if="!isProgressHidden"/>
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

.blank_row
{
    background-color: #FFFFFF;
}


.blank_row th{
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