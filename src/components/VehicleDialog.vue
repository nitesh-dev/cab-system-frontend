<script lang="ts">
export class VehicleData {

    isHidden = true
    vehicleId = 0
    type = "Bike"
    rate = 0
    seats = 1
    isCreate = true

    create() {
        this.isHidden = false
        this.isCreate = true
    }
    edit(vehicleId: number, type: string, rate: number, seats: number) {
        this.isHidden = false
        this.vehicleId = vehicleId
        this.type = type
        this.rate = rate
        this.seats = seats
        this.isCreate = false
    }
    close() {
        this.isHidden = true
    }

    reloadData() { }

    hideProgress() { }
    showProgress() { }
    showMessage(text: string) { }
}

</script>


<script setup lang='ts'>
import Api from '../api'

let prop = defineProps<{
    vehicle: VehicleData
}>()



async function onSubmitForm() {

    prop.vehicle.showProgress()
    let result = await Api.createUpdateVehicle(prop.vehicle.vehicleId, prop.vehicle.type, prop.vehicle.rate, prop.vehicle.seats, prop.vehicle.isCreate)
    prop.vehicle.close()
    prop.vehicle.hideProgress()

    if (result.isSuccess == true) {
        prop.vehicle.reloadData()
    } else {
        prop.vehicle.showMessage(result.error)
    }

}



</script>
<template>
    <div id="message-model" v-if="!vehicle.isHidden" class="modal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="cus-container text-center">
                    <form class="form-vehicle" @submit.prevent="onSubmitForm">

                        <h1 class="h3 mb-3 font-weight-normal" v-if="vehicle.isCreate">Create</h1>
                        <h1 class="h3 mb-3 font-weight-normal" v-else>Update</h1>

                        <div class="form-group row">
                            <label class="col-sm-2 col-form-label">Type</label>
                            <div class="col-sm-10">
                                <input type="text" v-model="vehicle.type" class="form-control" required="true">
                            </div>
                        </div>

                        <div class="form-group row">
                            <label class="col-sm-2 col-form-label">Rate</label>
                            <div class="col-sm-10">
                                <input type="number" v-model="vehicle.rate" class="form-control" required="true">
                            </div>
                        </div>

                        <div class="form-group row">
                            <label for="inputPassword" class="col-sm-2 col-form-label">Seats</label>
                            <div class="col-sm-10">
                                <input type="number" v-model="vehicle.seats" class="form-control" required="true">
                            </div>
                        </div>


                        <div class="row button-bar">
                            <div class="col">
                                <button class="btn btn-lg btn-secondary btn-block" @click="vehicle.close()">Close</button>
                            </div>
                            <div class="col">
                                <button class="btn btn-lg btn-primary btn-block" v-if="vehicle.isCreate"
                                    type="submit">Create
                                    vehicle</button>
                                <button class="btn btn-lg btn-primary btn-block" v-else>Update
                                    vehicle</button>

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

.form-group {
    margin-bottom: 10px;
}

.form-vehicle {
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

.button-bar {
    margin-top: 40px;
}

form>input {
    margin-top: 10px;
    padding: 12px;
}

#inputPassword {
    margin-bottom: 20px;
}
</style>