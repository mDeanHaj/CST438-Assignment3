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
    const [assignment, setAssignment] = useState({title:'', dueDate:'', courseId:'', secId:'', secNo:''});

    const addAssignment = async (assignment) => {
        try {
            const response = await fetch (`${SERVER_URL}/assignments`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(assignment),
                });
            if (response.ok) {
                const rc = await response.json();
                setAssignment(assignment);
            } else {
                const rc = await response.json();
                setMessage(rc.message);
            }
        } catch (err) {
            setMessage("network error: "+err);
        }
    }

    const editOpen = () => {
        setAssignment({title:'', dueDate:'', courseId:'', secId:'', secNo:''});
        setMessage('');
        setOpen(true);
    };

    const editClose = () => {
        setOpen(false);
        props.onClose();
    };

    const editChange = (event) => {
        setAssignment({...assignment,  [event.target.name]:event.target.value})
    }

    const onSave = () => {
        if (assignment.title==='') {
            setMessage("ERROR: Title can not be blank");
        } else if (assignment.dueDate==='') {
            setMessage("ERROR: Due date cannot be blank.");
        } else if (assignment.courseId==='') {
            setMessage("ERROR: Course ID cannot be blank.");
        } else {
            addAssignment(assignment);
        }
    }

    return (
        <>
            <Button onClick={editOpen}>Add Assignment</Button>
            <Dialog open={open} >
                <DialogTitle>Add Assignment</DialogTitle>
                <DialogContent  style={{paddingTop: 20}} >
                    <h4>{message}</h4>
                    <TextField style={{padding:10}} fullWidth label="title" name="title" value={assignment.title} onChange={editChange}  />
                    <TextField style={{padding:10}} autoFocus fullWidth label="dueDate" name="dueDate" value={assignment.dueDate} onChange={editChange}  />
                    <TextField style={{padding:10}} autoFocus fullWidth label="courseId" name="courseId" value={assignment.courseId} onChange={editChange}  />
                    <TextField style={{padding:10}} autoFocus fullWidth label="secId" name="secId" value={assignment.secId} onChange={editChange}  />
                    <TextField style={{padding:10}} autoFocus fullWidth label="secNo" name="secNo" value={assignment.secNo} onChange={editChange}  />
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" onClick={editClose}>Close</Button>
                    <Button color="primary" onClick={onSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </>                       
    )
}

export default AssignmentAdd;
