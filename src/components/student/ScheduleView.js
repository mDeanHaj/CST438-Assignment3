import React, { useState, useEffect } from 'react';
import { SERVER_URL } from '../../Constants';

// student can view schedule of sections 
// use the URL /enrollment?studentId=3&year=&semester=
// The REST api returns a list of EnrollmentDTO objects
// studentId=3 will be removed in assignment 7

// to drop a course 
// issue a DELETE with URL /enrollment/{enrollmentId}

const ScheduleView = (props) => {
    const [schedule, setSchedule] = useState([]);
    const [message, setMessage] = useState('');

    const { studentId, year, semester } = props;

    const fetchSchedule = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/enrollment?studentId=${3}&year=${year}&semester=${semester}`);
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

    useEffect(() => {
        fetchSchedule();
    }, [studentId, year, semester]);

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

    return (
        <>
            <h3>Your Schedule</h3>
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
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {schedule.map((s) => (
                        <tr key={s.enrollmentId}>
                            <td>{s.year}</td>
                            <td>{s.semester}</td>
                            <td>{s.courseId}</td>
                            <td>{s.sectionId}</td>
                            <td>{s.title}</td>
                            <td>{s.credits}</td>
                            <td>
                                <button onClick={() => dropCourse(s.enrollmentId)}>Drop</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default ScheduleView;
