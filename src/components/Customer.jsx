import { AgGridReact } from "ag-grid-react";
import React, { useEffect, useState } from "react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import AddCustomer from "./AddCustomer";
import EditCustomer from "./EditCustomer";
import { Button, Snackbar } from "@mui/material";

export default function Customer() {

    // states
    const [customers, setCustomers] = useState([{ firstname: '', lastname: '', streetaddress: '', postcode: '', city: '', email: '', phone: '' }])
    // viestiä päivityksen onnistumisesta, tallennukseta ja poistosta
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [msgSnackbar, setMsgSnackbar] = useState();

    const [colDefs, setColDefs] = useState([
        { headerName: 'Firstname', field: 'firstname', sortable: true, filter: true, floatingFilter: true },
        { headerName: 'Lastname', field: 'lastname', sortable: true, filter: true, floatingFilter: true },
        { headerName: 'Streetaddress', field: 'streetaddress', sortable: true, filter: true, floatingFilter: true },
        { headerName: 'Postcode', field: 'postcode', sortable: true, filter: true, floatingFilter: true },
        { headerName: 'City', field: 'city', sortable: true, filter: true, floatingFilter: true },
        { headerName: 'Email', field: 'email', sortable: true, filter: true, floatingFilter: true },
        { headerName: 'Phone', field: 'phone', sortable: true, filter: true, floatingFilter: true },
        { cellRenderer: params => <EditCustomer updateCustomer={updateCustomer} params={params} />, width: 120 },
        {
            cellRenderer: (params) =>
                <Button
                    size="small"
                    color="error"
                    onClick={() => deleteCustomer(params)}
                >
                    Delete
                </Button>
            , width: 120
        }
    ]);

    // hakee asiakkaat ainoastaan ensimmäisen renderöinnin jälkeen
    useEffect(() => getCustomers(), []);

    // haetaan kaikki asiakkaat, method GET
    const getCustomers = () => {
        fetch("https://customerrestservice-personaltraining.rahtiapp.fi/api/customers", { method: 'GET' })
            .then(response => {
                console.log(response);
                return response.json();
            })
            .then(responsedata => {
                console.log(responsedata._embedded.customers);
                setCustomers(responsedata._embedded.customers);
            })
            .catch(error => console.error(error))
    }

    // lisätään asikas, method POST
    // Snackbar käyttö!!! LISÄTTÄVÄ myöhemmin
    const addCustomer = (customer) => {
        fetch("https://customerrestservice-personaltraining.rahtiapp.fi/api/customers", {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(customer)
        })
            .then(response => {
                console.log(response);
                if (response.ok) {
                    setMsgSnackbar('The customer has been added');
                    setOpenSnackbar(true);
                } else {
                    throw new Error('Data export failed')
                }
            })
            .then(data => {
                getCustomers();
            })
            .catch(error => console.error(error))
    }

    // poistetaan asiakas
    const deleteCustomer = (params) => {
        if (window.confirm("Do you want to delete customer?")) {
            fetch(params.data._links.customer.href, { method: 'DELETE' })
                .then(response => {
                    if (response.ok) {
                        setMsgSnackbar("The customer was deleted successfully!")
                        setOpenSnackbar(true);
                        getCustomers(); // haetaan uudelleen päivitetty tilanne
                    } else {
                        setMsgSnackbar("Something went wrong with deleting.")
                        setOpenSnackbar(true);
                    }
                })
                .catch(error => console.error(error));
        }
    }

    // Huom, PUT päivitettäessä, URL tulee suoraan restistä, missä on indeksi urlissa.
    const updateCustomer = (URL, updatedCustomer) => {
        console.log("customer: addCustomer");
        fetch(URL, {
            method: 'PUT',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(updatedCustomer)
        })
            .then(response => {
                console.log("Customer: updatedcustomer ");
                if (response.ok) {
                    setMsgSnackbar('The customer info has been edited');
                    setOpenSnackbar(true);
                    return response.json();
                } else {
                    throw new Error('Data export failed')
                }
            })
            .then(data => {
                console.log("parsed JSON = " + data);
                getCustomers();
            })
    }

    // return ja propsi addCustomer
    return (
        <>
            <AddCustomer addCustomer={addCustomer} />
            <div className="ag-theme-material" style={{ width: 1200, height: 800, margin: 'auto' }}>
                <AgGridReact
                    rowData={customers}
                    columnDefs={colDefs}
                >
                </AgGridReact>
                <Snackbar
                    open={openSnackbar}
                    message={msgSnackbar}
                    autoHideDuration={3000}
                    onClose={() => {
                        setOpenSnackbar(false);
                        setMsgSnackbar("")}}>
                </Snackbar>
            </div>
        </>
    )

}