namespace Api {
    const apiURL = 'http://localhost:8080'


    export async function signIn(email: string, password: string) {
        let data = {
            email: email,
            password: password
        }

        let path = `sign-in`
        try {
            let res = await fetchData(path, data)
            if (res.status == 200) {
                let json = await res.json()
                return { isSuccess: true, accountId: json.accountId, accountType: json.accountType }
            } else {
                let message = await res.json()
                return { isSuccess: false, error: message.error }
            }
        } catch (error: any) {
            return { isSuccess: false, error: error.message };
        }
    }

    export async function signUp(name: string, number: string, email: string, password: string, accountType: string) {

        let data = {
            name: name,
            number: number,
            email: email,
            password: password,
            accountType: accountType
        }
        let path = `sign-up`
        try {
            let res = await fetchData(path, data)
            if (res.status == 201) {
                let json = await res.json()
                return { isSuccess: true, accountId: json.accountId, accountType: json.accountType }
            } else {
                let message = await res.json()
                return { isSuccess: false, error: message.error }
            }
        } catch (error: any) {
            return { isSuccess: false, error: error.message };
        }

    }


    export async function getAccountDetail(accountId: number, accountType: string) {
        let data = {
            accountId: accountId,
            accountType: accountType
        }

        let path = `account-detail`
        try {
            let res = await fetchData(path, data)
            if (res.status == 200) {
                let json = await res.json()
                return { isSuccess: true, data: json }
            } else {
                let message = await res.json()
                return { isSuccess: false, error: message.error }
            }
        } catch (error: any) {
            return { isSuccess: false, error: error.message };
        }
    }


    export async function getAllCustomerAccounts(accountId: number) {
        let data = {
            accountId: accountId
        }
        let path = `all-customers`
        try {
            let res = await fetchData(path, data)
            if (res.status == 200) {
                let json = await res.json()
                return { isSuccess: true, data: json }
            } else {
                let message = await res.json()
                return { isSuccess: false, error: message.error }
            }
        } catch (error: any) {
            return { isSuccess: false, error: error.message };
        }
    }


    export async function getAllDriverAccounts(accountId: number) {
        let data = {
            accountId: accountId
        }
        let path = `all-drivers`
        try {
            let res = await fetchData(path, data)
            if (res.status == 200) {
                let json = await res.json()
                return { isSuccess: true, data: json }
            } else {
                let message = await res.json()
                return { isSuccess: false, error: message.error }
            }
        } catch (error: any) {
            return { isSuccess: false, error: error.message };
        }
    }

    export async function getAllPlans() {
        let data = {}
        let path = `all-plans`
        try {
            let res = await fetchData(path, data)
            if (res.status == 200) {
                let json = await res.json()
                return { isSuccess: true, data: json }
            } else {
                let message = await res.json()
                return { isSuccess: false, error: message.error }
            }
        } catch (error: any) {
            return { isSuccess: false, error: error.message };
        }
    }


    export async function getAllBookingList(accountId: number) {
        let data = {
            accountId: accountId
        }
        let path = `all-booking`
        try {
            let res = await fetchData(path, data)
            if (res.status == 200) {
                let json = await res.json()
                return { isSuccess: true, data: json }
            } else {
                let message = await res.json()
                return { isSuccess: false, error: message.error }
            }
        } catch (error: any) {
            return { isSuccess: false, error: error.message };
        }
    }


    export async function getDriverAllTaskList(accountId: number) {
        let data = {
            accountId: accountId
        }
        let path = `driver-all-task`
        try {
            let res = await fetchData(path, data)
            if (res.status == 200) {
                let json = await res.json()
                return { isSuccess: true, data: json }
            } else {
                let message = await res.json()
                return { isSuccess: false, error: message.error }
            }
        } catch (error: any) {
            return { isSuccess: false, error: error.message };
        }
    }


    export async function updateAccount(accountType: string, accountId: number, name: string, number: string, password: string) {
        let data = {
            accountId: accountId,
            accountType: accountType,
            name: name,
            number: number,
            password: password
        }
        let path = `update-account-detail`
        try {
            let res = await fetchData(path, data)
            if (res.status == 200) {
                return { isSuccess: true }
            } else {
                let message = await res.json()
                return { isSuccess: false, error: message.error }
            }
        } catch (error: any) {
            return { isSuccess: false, error: error.message };
        }
    }


    export async function getCustomerAllBooking(accountId: number) {
        let data = {
            accountId: accountId,
        }
        let path = `customer-all-booking`
        try {
            let res = await fetchData(path, data)
            if (res.status == 200) {
                let json = await res.json()
                console.table(json)
                return { isSuccess: true, data: json }
            } else {
                let message = await res.json()
                return { isSuccess: false, error: message.error }
            }
        } catch (error: any) {
            return { isSuccess: false, error: error.message };
        }
    }











    // function fetchData(path: string, data = {}) {
    //     let requestOptions: RequestInit = {
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         method: 'POST',
    //         redirect: 'follow',
    //         body: JSON.stringify(data)
    //     }
    //     return fetch(`${apiURL}/${path}`, requestOptions)
    // }

    let timeout = 5000
    async function fetchData(path: string, data = {}) {

        const requestOptions: RequestInit = {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            redirect: "follow",
            body: JSON.stringify(data),
        };

        const fetchPromise = fetch(`${apiURL}/${path}`, requestOptions);

        // Create a timeout promise that rejects after the specified timeout
        const timeoutPromise = new Promise<Response>((_, reject) => {
            setTimeout(() => {
                reject(new Error("Request timed out"));
            }, timeout);
        });

        // Use Promise.race to resolve or reject the first promise that completes
        return Promise.race([fetchPromise, timeoutPromise]);
    }

}
export default Api

