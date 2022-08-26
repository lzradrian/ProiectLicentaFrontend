import { Button, Form, Input, Space, Select, Table, Modal } from 'antd';
import { MinusCircleOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState, useEffect } from "react";
import moment from 'moment'
import DoctorService from './doctor.service'
import AuthService from '../authentication/auth.service';

function DoctorMedicalSheetBoard() {

    const [patients, setPatients] = useState([]);

    const [medicalSheets, setMedicalSheets] = useState([]);

    const [visible, setVisible] = useState(false);

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
            title: 'Patient',
            dataIndex: 'patientId',
            key: 'patientId',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
        {
            key: "actions",
            title: "",
            render: (record) => {
                return (
                    <>
                        <DeleteOutlined
                            onClick={() => {
                                onDeleteMedicalSheet(record);
                            }}
                            style={{ color: "red", marginLeft: 12 }}
                        />
                    </>
                );
            },
        },
    ];

    const onDeleteMedicalSheet = (record) => {
        Modal.confirm({
            title: "Are you sure, you want to delete this medical sheet record?",
            okText: "Yes",
            okType: "danger",
            onOk: () => {
                DoctorService.deleteMedicalSheet(record.timestamp)
                    .then(response => {
                        console.info(response);
                        setMedicalSheets((pre) => {
                            return pre.filter((sheet) => sheet.timestamp !== record.timestamp);
                        });
                    },
                        error => {
                            console.info(error)
                        }
                    );
            },
        });
    };

    const CollectionCreateForm = ({ visible, onCreate, onCancel }) => {
        const [form] = Form.useForm();
        return (
            <Modal
                visible={visible}
                title="Add medical sheet"
                okText="Save"
                cancelText="Cancel"
                onCancel={onCancel}
                onOk={() => {
                    form
                        .validateFields()
                        .then((values) => {
                            form.resetFields();
                            onCreate(values);
                        })
                        .catch((info) => {
                            console.log('Validate Failed:', info);
                        });
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="form_in_modal"
                    initialValues={{
                        modifier: 'public',
                    }}
                >
                    <Form.Item name="name"
                        rules={[{ required: true, message: 'Please add a value!' }]}
                    >
                        <Input addonBefore="Sheet name" />
                    </Form.Item>

                    <Form.Item name="patientId"
                        rules={[{ required: true, message: "Please add a value!" }]}
                    >
                        <Select placeholder="Select a patient">
                            {patients.map((patient) => (
                                <Select.Option key={patient.username} value={patient.username}>{patient.username} / {patient.patientName} / {patient.sex}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.List name="medicalAnalyses" >
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space
                                        key={key}
                                        style={{
                                            display: 'flex',
                                            marginBottom: 2,
                                            marginTop: 10,
                                        }}
                                        align="center"
                                    >
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'name']}
                                            rules={[{ required: true, message: 'Please add a value!' }]}
                                        >
                                            <Input placeholder="Name" />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'result']}
                                            rules={[{ required: true, message: 'Please add a value!' }]}
                                        >
                                            <Input placeholder="Result value" />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'reference']}
                                            rules={[{ required: true, message: 'Please add a value!' }]}
                                        >
                                            <Input placeholder="Reference value" />
                                        </Form.Item>

                                        <MinusCircleOutlined style={{ color: 'red' }} onClick={() => remove(name)} />
                                    </Space>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        Add medical analyse
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Form>
            </Modal>
        );
    };

    useEffect(() => {
        DoctorService.getAllMedicalSheets()
            .then(response => {
                response.forEach((item, index) => item.key = index.toString());
                response.forEach((item) => item.date = moment.unix(item.timestamp / 1000).format('D MMM YYYY'));
                setMedicalSheets(response);
            }
            );
        DoctorService.getAllPatients()
            .then(response => {
                setPatients(response);
            })
    }, []);

    const onCreate = (values) => {
        let currentUser = AuthService.getCurrentUser();
        values.doctorName = currentUser.doctorName;
        DoctorService.createMedicalSheet(values)
            .then(
                response => {
                    response.date = moment.unix(response.timestamp / 1000).format('D MMM YYYY');
                    setMedicalSheets((pre) => {
                        return [...pre, response];
                    });
                }
            );
        setVisible(false);
    };

    return (
        <div className="App">
            <div className="App-body">
                <h4 style={{ color: 'white', marginBottom: '20px' }}>List of all patients medical sheets.</h4>

                <Table
                    columns={columns}
                    expandable={{
                        expandedRowRender,
                    }}
                    dataSource={medicalSheets}
                />

                <div>
                    <Button
                        type="primary"
                        onClick={() => {
                            setVisible(true);
                        }}
                    >
                        Add new medical sheet
                    </Button>
                    <CollectionCreateForm
                        visible={visible}
                        onCreate={onCreate}
                        onCancel={() => {
                            setVisible(false);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default DoctorMedicalSheetBoard;