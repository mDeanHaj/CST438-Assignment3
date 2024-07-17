import React, {useEffect, useState} from 'react';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import {SERVER_URL} from "../../Constants";
// complete the code.  
// instructor adds an assignment to a section
// use mui Dialog with assignment fields Title and DueDate
// issue a POST using URL /assignments to add the assignment

const AssignmentAdd = (props)  => {

    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [assignment, setAssignment] = useState({title:'', dueDate:''});

    const editOpen = () => {
        setOpen(true);
        setAssignment({title:'', dueDate:''});
        setMessage('');
    };

    const editClose = () => {
        setOpen(false);
        setAssignment({ title:'', dueDate:''});
        setMessage('');
        props.onClose();
    };

    const editChange = (event) => {
        setAssignment({...assignment,  [event.target.name]:event.target.value})
    }

    const onSave = () => {
        props.save(assignment);
        setMessage("Assignment added");
        // editClose();
    }

    return (
        <>
            <Button id="addAssignment" onClick={editOpen}>Add Assignment</Button>
            <Dialog open={open} >
                <DialogTitle>Add Assignment</DialogTitle>
                <DialogContent  style={{paddingTop: 20}} >
                    <h4 id="addAssignmentMessage">{message}</h4>
                    <TextField style={{padding:10}} autoFocus fullWidth id="aTitle" label="title" name="title" value={assignment.title} onChange={editChange}  />
                    <TextField style={{padding:10}} fullWidth id="aDueDate" label="dueDate" name="dueDate" value={assignment.dueDate} onChange={editChange}  />
                </DialogContent>
                <DialogActions>
                    <Button id="closeDialog" color="secondary" onClick={editClose}>Close</Button>
                    <Button id="saveAssignment" color="primary" onClick={onSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </>                       
    )
}

export default AssignmentAdd;
