import React, { useState, useEffect } from 'react';
import { SERVER_URL } from "../../Constants";
import { confirmAlert } from "react-confirm-alert";
import Button from "@mui/material/Button";

// student can view schedule of sections 
// use the URL /enrollment?studentId=3&year= &semester=
// The REST api returns a list of EnrollmentDTO objects
// studentId=3 will be removed in assignment 7

// to drop a course 
// issue a DELETE with URL /enrollment/{enrollmentId}

const ScheduleView = (props) => {
    const [schedule, setSchedule] = useState([]);
    const [message, setMessage] = useState('');

    const fetchSchedule = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/enrollment?studentId=3&year=&semester=`);
            if (response.ok) {
                const json = await response.json();
                setSchedule(json);
            } else {
                const json = await response.json();
                setMessage("response error: " + json.message);
            }
        } catch (err) {
            setMessage("network error: " + err);
        }
    };

    const dropCourse = async (enrollmentId) => {
        try {
            const response = await fetch(`${SERVER_URL}/enrollment/${enrollmentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                setMessage("Course dropped");
                fetchSchedule();
            } else {
                const json = await response.json();
                setMessage("response error: " + json.message);
            }
        } catch (err) {
            setMessage("network error: " + err);
        }
    };

    useEffect(() => {
        fetchSchedule();
    }, []);

    const onDrop = (e, enrollmentId) => {
        confirmAlert({
            title: 'Confirm to drop',
            message: 'Do you really want to drop this course?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => dropCourse(enrollmentId)
                },
                {
                    label: 'No',
                }
            ]
        });
    };

    return (
        <>
            <h3>Class Schedule</h3>
            <h4>{message}</h4>
            <table className="Center">
                <thead>
                    <tr>
                        <th>Year</th>
                        <th>Semester</th>
                        <th>CourseId</th>
                        <th>SectionId</th>
                        <th>Title</th>
                        <th>Credits</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {schedule.map((enrollment) => (
                        <tr key={enrollment.id}>
                            <td>{enrollment.year}</td>
                            <td>{enrollment.semester}</td>
                            <td>{enrollment.courseId}</td>
                            <td>{enrollment.sectionId}</td>
                            <td>{enrollment.title}</td>
                            <td>{enrollment.credits}</td>
                            <td><Button onClick={(e) => onDrop(e, enrollment.id)}>Drop</Button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default ScheduleView;
