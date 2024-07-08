import React, { useState, useEffect } from 'react';
import { SERVER_URL } from "../../Constants";
import Button from "@mui/material/Button";

// instructor enters students' grades for an assignment
// fetch the grades using the URL /assignment/{id}/grades
// REST api returns a list of GradeDTO objects
// display the list as a table with columns 'gradeId', 'student name', 'student email', 'score' 
// score column is an input field 
//  <input type="text" name="score" value={g.score} onChange={onChange} />

const AssignmentGrade = (props) => {
    const { assignmentId } = props;
    const [grades, setGrades] = useState([]);
    const [message, setMessage] = useState('');

    const fetchGrades = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/assignment/${assignmentId}/grades`);
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
    }, [assignmentId]);

    const onChange = (e, index) => {
        const newGrades = [...grades];
        newGrades[index].score = e.target.value;
        setGrades(newGrades);
    };

    const saveGrades = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/assignment/${assignmentId}/grades`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(grades),
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

    return (
        <>
            <h3>Assignment Grades</h3>
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
                    {grades.map((g, index) => (
                        <tr key={g.gradeId}>
                            <td>{g.gradeId}</td>
                            <td>{g.studentName}</td>
                            <td>{g.studentEmail}</td>
                            <td>
                                <input
                                    type="text"
                                    name="score"
                                    value={g.score}
                                    onChange={(e) => onChange(e, index)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Button onClick={saveGrades}>Save Grades</Button>
        </>
    );
}

export default AssignmentGrade;
