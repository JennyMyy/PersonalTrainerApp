import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import React, { useState } from "react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";



export default function addTraining(props) {


    const [training, setTraining] = useState([{ date: '', duration: '', activity: '', _links: '' }])

    // ikkunan arvo oletuksena false, kun kiinni, true, kun auki
    const [open, setOpen] = React.useState(false);

    // ikkunan avaaminen, syöttöikkuna aukeaa klikattaessa
    const handleClickOpen = () => {
        setOpen(true);
    }

    // ikunan sulkeminen, kun halutaan peruuttaa asiakkaan lisäämisestä
    const handleCancel = () => setOpen(false);

    // asiakkaan tietojen tallentaminen
    const handleSave = () => {
        console.log("Saved training" + training)
        props.addTraining(training);
        setOpen(false);
    }

    return (
        <div>
            <Button
                variant="contained"
                onClick={handleClickOpen}>
                Add
            </Button>

            <Dialog open={open}>
                <DialogTitle>
                    Add new training
                </DialogTitle>
                <DialogContent>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            value={training.date || null}
                            onChange={(e) => {
                                if (e) {
                                    setTraining({ ...training, date: e });
                                }
                            }}
                        />
                    </LocalizationProvider>
                    <TextField
                        margin="dense"
                        label="Duration"
                        value={training.duration || ''}
                        onChange={(e) => setTraining({ ...training, duration: e.target.value })}
                        variant="standard"
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Activity"
                        value={training.activity || ''}
                        onChange={(e) => setTraining({ ...training, activity: e.target.value })}
                        variant="standard"
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Customer"
                        value={training._links || ''}
                        onChange={(e) => setTraining({ ...training, _links: e.target.value })}
                        variant="standard"
                        fullWidth
                    />
                    
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSave}>Save</Button>
                    <Button onClick={handleCancel}>Cancel</Button>
                </DialogActions>
            </Dialog>

        </div>
    )
}