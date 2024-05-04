import { AgGridReact } from 'ag-grid-react';
import React, { useEffect, useState } from 'react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import AddTraining from './AddTraining';
import { Button, Snackbar } from '@mui/material';
import moment from 'moment';

export default function Training() {

    // states
    const [trainings, setTrainings] = useState(null)
    // viestiä päivityksen onnistumisesta, tallennukseta ja poistosta
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [msgSnackbar, setMsgSnackbar] = useState();


    const [columDefs, setColumDefs] = useState([
        { headerName: 'Id', field: 'id', sortable: true, filter: true, floatingFilter: true },
        {
            headerName: 'Date', field: 'date', sortable: true, filter: true, floatingFilter: true,
            cellRenderer: (params) => {
                const formattedDate = moment(params.value).format('DD.MM.YYYY HH:mm');
                return formattedDate; // päivämäärien muotoilu
            }
        },
        { headerName: 'Duration', field: 'duration', sortable: true, filter: true, floatingFilter: true, },
        { headerName: 'Activity', field: 'activity', sortable: true, filter: true, floatingFilter: true },
        // chatgbt auttoi saamaan asiakkaan nimen listaan -> valueGetter: (params) => params.data.customer ? `${params.data.customer.firstname} ${params.data.customer.lastname}` 
        { headerName: 'Customer', field: 'customer', valueGetter: (params) => params.data.customer ? `${params.data.customer.firstname} ${params.data.customer.lastname}` : '', sortable: true, filter: true, floatingFilter: true },
        {
            cellRenderer: (params) =>
                <Button
                    size="small"
                    color="error"
                    onClick={() => deleteTraining(params)}
                >
                    Delete
                </Button>
            , width: 120
        }
    ])

    // haetaan kaikki liikuntaohjelmat, ensimmäinen renderöinti
    useEffect(() => getTrainings(), []);

    //haetaan liikuntaohjelmat
    const getTrainings = () => {
        fetch("https://customerrestservice-personaltraining.rahtiapp.fi/gettrainings", { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                console.log(data); // Varmista, että data on oikean muotoinen
                setTrainings(data);
            })
            .catch(error => console.error(error));
    }

    // lisätään harjoitus
    const addTraining = (training) => {
        console.log("Adding training:", training); 
        fetch("https://customerrestservice-personaltraining.rahtiapp.fi/api/trainings",
            {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(training)
            })
            .then(response => {
                console.log("Response:", response);
                if (response.ok) {
                    setMsgSnackbar('The training has been added');
                    setOpenSnackbar(true);
                    return response.json(); 
                } else {
                    throw new Error('Data export failed')
                }
            })
            .then(data => {
                console.log("New training data:", data); // Tarkista vastaus uusista koulutustiedoista
                getTrainings(); // hakee koulutustiedot vasta POST-pyynnön onnistumisen jälkeen
            })
            .catch(error => console.error(error))
    }

    // poistetaan treeni
    const deleteTraining = (params) => {
        if (window.confirm("Do you want to delete training?")) {
            fetch(`https://customerrestservice-personaltraining.rahtiapp.fi/api/trainings/${params.data.id}`, { method: 'DELETE' })
                .then(response => {
                    console.log("Deleting training with ID:", params.data.id);
                    if (response.ok) {
                        setMsgSnackbar("The customer was deleted successfully!")
                        setOpenSnackbar(true);
                        getTrainings(); // haetaan uudelleen päivitetty tilanne
                    } else {
                        setMsgSnackbar("Something went wrong with deleting.")
                        setOpenSnackbar(true);
                    }
                })
                .catch(error => console.error("Fetch error:", error));
        }
    }

    // return + props 
    return (

        <>

            <AddTraining addTraining={addTraining} />
            <div className="ag-theme-material" style={{ width: 1200, height: 800, margin: 'auto' }}>
                <AgGridReact
                    rowData={trainings}
                    columnDefs={columDefs}
                >
                </AgGridReact>
                <Snackbar
                    open={openSnackbar}
                    message={msgSnackbar}
                    autoHideDuration={3000}
                    onClose={() => {
                        setOpenSnackbar(false);
                        setMsgSnackbar("")
                    }}>
                </Snackbar>
            </div>
        </>

    );

}