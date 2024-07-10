import React, { useState, useEffect } from 'react';
import { SERVER_URL } from '../../Constants';

// instructor enters students' grades for an assignment
// fetch the grades using the URL /assignment/{id}/grades
// REST api returns a list of GradeDTO objects
// display the list as a table with columns 'gradeId', 'student name', 'student email', 'score'
// score column is an input field
//  <input type="text" name="score" value={g.score} onChange={onChange} />

const AssignmentGrade = (props) => {
    const [grades, setGrades] = useState([]);
    const [message, setMessage] = useState('');
    const { id } = props;

    const fetchGrades = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/assignments/${id}/grades`);
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
    }, [id]);

    const updateGrade = (gradeId, score) => {
        setGrades(grades.map(g => g.gradeId === gradeId ? { ...g, score: score !== '' ? parseInt(score) : null } : g));
    };

    const saveGrades = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/grades`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([grades]),
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

    const onChange = (event, gradeId) => {
        const score = event.target.value;
        updateGrade(gradeId, score);
    };

    return (
        <>
            <h3>Grade Assignment</h3>
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
                            <input type="text" name="score" value={g.score !== null ? g.score : ''} onChange={(e) => onChange(e, g.gradeId)} />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <button onClick={saveGrades}>Save Grades</button>
        </>
    );
}

export default AssignmentGrade;