import React, { useState, useEffect } from 'react';
import { SERVER_URL } from '../../Constants';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";

// instructor enters students' grades for an assignment
// fetch the grades using the URL /assignment/{id}/grades
// REST api returns a list of GradeDTO objects
// display the list as a table with columns 'gradeId', 'student name', 'student email', 'score'
// score column is an input field
//  <input type="text" name="score" value={g.score} onChange={onChange} />

const AssignmentGrade = (props) => {
    const [open, setOpen] = useState(false);
    const [grades, setGrades] = useState([]);
    const [message, setMessage] = useState('');
    const [assignment, setAssignment] = useState({title:'', dueDate:''});
    const [grade, setGrade] = useState({score:''});

    const fetchGrades = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/assignments/${props.assignment.id}/grades`);
            if (response.ok) {
                const json = await response.json();
                setGrades(json);
            } else {
                const json = await response.json();
                setMessage("response error: " + json.message);
            }
        } catch (err) {
            setMessage("network error: " + err);
        }
    };

    useEffect(() => {
        fetchGrades();
    }, []);

    const updateGrade = (gradeId, score) => {
        setGrades(grades.map(g => g.gradeId === gradeId ? { ...g, score: score !== '' ? parseInt(score) : null } : g));
    };

    const saveGrades = async (grade) => {
        try {
            const response = await fetch(`${SERVER_URL}/grades`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([grade]),
            });
            if (response.ok) {
                setMessage("Grades saved successfully");
            } else {
                const json = await response.json();
                setMessage("response error: " + json.message);
            }
        } catch (err) {
            setMessage("network error: " + err);
        }
    };

    const saveAssignment = async (assignment) => {
        try {
            const response = await fetch (`${SERVER_URL}/assignments`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(assignment),
                });
            if (response.ok) {
                setMessage("assignment saved")
            } else {
                const json = await response.json();
                setMessage("response error: "+json.message);
            }
        } catch (err) {
            setMessage("network error: "+err);
        }
    }

    const onSave = () => {
        saveGrades(grade);
    }

    const editOpen = () => {
        setMessage('');
        setGrade({score:''});
        setOpen(true);
    };

    const editClose = () => {
        setOpen(false);
        props.onClose();
    };

    const onChange = (event, grade) => {
        const score = event.target.value;
        setGrade(grade);
        updateGrade(grade.gradeId, score);
    };

    return (
        <>
            <Button onClick={editOpen}>Grade</Button>
            <Dialog open={open} >
                <DialogTitle>Grade Assignment</DialogTitle>
                <DialogContent style={{paddingTop: 20}}>
                    <h4>{message}</h4>
                    <table className="Center">
                        <thead>
                        <tr>
                            <th>GradeId</th>
                            <th>Student Name</th>
                            <th>Student Email</th>
                            <th>Score</th>
                        </tr>
                        </thead>
                        <tbody>
                        {grades.map((g) => (
                            <tr key={g.gradeId}>
                                <td>{g.gradeId}</td>
                                <td>{g.studentName}</td>
                                <td>{g.studentEmail}</td>
                                <td>
                                    <input type="text" name="score" value={g.score !== null ? g.score : ''}
                                           onChange={(e) => onChange(e, g)}/>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" onClick={editClose}>Close</Button>
                    <Button color="primary" onClick={onSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default AssignmentGrade;