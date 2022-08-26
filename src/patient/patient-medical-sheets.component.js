import { Table } from 'antd';
import { useState, useEffect } from "react";
import moment from 'moment'
import AuthService from '../authentication/auth.service';
import PatientService from './patient.service';

function PatientMedicalSheetBoard() {

    const [medicalSheets, setMedicalSheets] = useState([]);

    const expandedRowRender = (record) => {
        let medicalAnalyses = record.medicalAnalyses;
        const columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'Result',
                dataIndex: 'result',
                key: 'result',
            },
            {
                title: 'Reference',
                dataIndex: 'reference',
                key: 'reference',
            }
        ];
        return <Table columns={columns} dataSource={medicalAnalyses} pagination={false} />;
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Doctor name',
            dataIndex: 'doctorName',
            key: 'doctorName',
        },
        {
            title: 'Date',
            dataIndex: 'timestamp',
            key: 'timestamp',
        }
    ];

    useEffect(() => {
        let currentUser = AuthService.getCurrentUser();
        PatientService.getPatientMedicalSheets(currentUser.username)
            .then(response => {
                response.forEach((item, index) => item.key = index.toString());
                response.forEach((item) => item.timestamp = moment.unix(item.timestamp / 1000).format('D MMM YYYY'));
                setMedicalSheets(response);
            }
            )
    }, []);

    return (
        <div className="App">
            <div className="App-body">
                <h4 style={{ color: 'white', marginBottom: '20px' }}>List of your medical sheets</h4>
                <Table
                    columns={columns}
                    expandable={{
                        expandedRowRender,
                    }}
                    dataSource={medicalSheets}
                />
            </div>
        </div>
    );
}

export default PatientMedicalSheetBoard;