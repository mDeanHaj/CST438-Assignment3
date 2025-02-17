import React, {useState, useEffect} from 'react';
import {Link, useLocation} from 'react-router-dom'
import {SERVER_URL} from "../../Constants";

// instructor views a list of sections they are teaching 
// use the URL /sections?email=dwisneski@csumb.edu&year= &semester=
// the email= will be removed in assignment 7 login security
// The REST api returns a list of SectionDTO objects
// The table of sections contains columns
//   section no, course id, section id, building, room, times and links to assignments and enrollments
// hint:  
// <Link to="/enrollments" state={section}>View Enrollments</Link>
// <Link to="/assignments" state={section}>View Assignments</Link>

const InstructorSectionsView = (props) => {
    const location = useLocation();
    const {year, semester} = location.state;
    const headers = ['SecNo', 'CourseId', 'SecId',  'Year', 'Semester', 'Building', 'Room', 'Times', ' ', ' '];
    const [sections, setSections] = useState([]);
    const [message, setMessage] = useState('');

    const  fetchInstructorSections = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/sections?email=${'dwisneski@csumb.edu'}&year=${year}&semester=${semester}`);
            if (response.ok) {
                const json = await response.json();
                setSections(json);
            } else {
                const json = await response.json();
                setMessage("response error: "+json.message);
            }
        } catch (err) {
            setMessage("network error: "+err);
        }
    }

    useEffect( () => {
        fetchInstructorSections();
    },  []);
     
    return(
        <>
            <h3>Your Sections</h3>
            <h4>{message}</h4>
            <table className="Center">
                <thead>
                <tr>
                    {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
                </tr>
                </thead>
                <tbody>
                {sections.map((s) => (
                    <tr key={s.secNo}>
                        <td>{s.secNo}</td>
                        <td>{s.courseId}</td>
                        <td>{s.secId}</td>
                        <td>{s.year}</td>
                        <td>{s.semester}</td>
                        <td>{s.building}</td>
                        <td>{s.room}</td>
                        <td>{s.times}</td>
                        <Link to="/enrollments" state={s}>View Enrollments</Link>
                        <Link to="/assignments" state={s}>View Assignments</Link>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
}

export default InstructorSectionsView;

