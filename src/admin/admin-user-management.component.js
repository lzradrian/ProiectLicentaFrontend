import "antd/dist/antd.css";
import { Button, Table, Modal, Input, Form, Alert, Select, DatePicker, Switch } from "antd";
import { useState, useEffect, useTransition } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import AdminService from "./admin.service";
import errorHandler from "../common/ErrorHandler";

function UserManagementBoard() {
    const [isEditing, setIsUpdating] = useState(false);
    const [editingUser, setUpdatingUser] = useState(null);

    const [isAdding, setIsAdding] = useState(false);

    const [allUsers, setAllUsers] = useState([]);
    const [dataSource, setDataSource] = useState([]);

    const [usersRole, setUsersRole] = useState(null);

    const commonColumns = [
        {
            key: "10",
            title: "Email",
            dataIndex: ['contactDetails', 'email']
        },
        {
            key: "11",
            title: "Phone",
            dataIndex: ['contactDetails', 'phone']
        },
        {
            key: "12",
            title: "Address",
            dataIndex: ['contactDetails', 'address']
        },
        {
            key: "13",
            title: "Actions",
            render: (record) => {
                return (
                    <>
                        <EditOutlined
                            onClick={() => {
                                onUpdateUser(record);
                            }}
                        />
                        <DeleteOutlined
                            onClick={() => {
                                onDeleteUser(record);
                            }}
                            style={{ color: "red", marginLeft: 12 }}
                        />
                    </>
                );
            },
        },
    ]
    const adminTableColumns = [
        {
            key: "1",
            title: "Username",
            dataIndex: "username",
        },
        {
            key: "2",
            title: "Name",
            dataIndex: "adminName"
        },
    ];
    const doctorTableColumns = [
        {
            key: "1",
            title: "Username",
            dataIndex: "username",
        },
        {
            key: "2",
            title: "Name",
            dataIndex: "doctorName"
        },
    ];
    const patientTableColumns = [
        {
            key: "1",
            title: "Username",
            dataIndex: "username",
        },
        {
            key: "2",
            title: "Name",
            dataIndex: "patientName"
        },
        {
            key: "3",
            title: "Personal ID",
            dataIndex: "personalIdentificationCode"
        },
        {
            key: "4",
            title: "Birth Date",
            dataIndex: "birthDate"
        },
        {
            key: "5",
            title: "Sex",
            dataIndex: "sex"
        },
    ];

    const getTableColumns = () => {
        if (usersRole == 'ROLE_ADMIN') {
            const columns = [...adminTableColumns, ...commonColumns];
            return columns;
        }
        if (usersRole == 'ROLE_DOCTOR') {
            const columns = [...doctorTableColumns, ...commonColumns];
            return columns;
        }
        if (usersRole == 'ROLE_PATIENT') {
            const columns = [...patientTableColumns, ...commonColumns];
            return columns;
        }
        return commonColumns;
    }

    useEffect(() => {
        AdminService.getAllUsers()
            .then(response => {
                setAllUsers(response);
            }
            )
    }, []);

    const onChangeUsersRole = (userRole) => {
        let specificRoleUsers = allUsers.filter(user => user.roleName === userRole);
        setDataSource(specificRoleUsers);
        setUsersRole(userRole);
    }

    const onDeleteUser = (record) => {
        Modal.confirm({
            title: "Are you sure, you want to delete this user record?",
            okText: "Yes",
            okType: "danger",
            onOk: () => {
                AdminService.deleteUser(record.username)
                    .then(response => {
                        console.info(response);
                        setDataSource((pre) => {
                            return pre.filter((user) => user.username !== record.username);
                        });
                    },
                        error => {
                            console.info(error)
                        }
                    );
            },
        });
    };

    const onUpdateUser = (record) => {
        setIsUpdating(true);
        setUpdatingUser({ ...record });
    };
    const resetUpdating = () => {
        setIsUpdating(false);
        setUpdatingUser(null);
    };

    const UserUpdateForm = ({ visible, onCancel }) => {
        const [form] = Form.useForm();
        const [errorMessage, setErrorMessage] = useState(null);
        const [passwordInput, setPasswordInput] = useState(false);

        const handleUpdateUser = (user) => {
            user.username = editingUser?.username;
            user.birthDate = editingUser?.birthDate;
            user.personalIdentificationCode = editingUser?.personalIdentificationCode;
            user.sex = editingUser?.sex;
            if (user.passwordInputValue) {
                user.password = user.passwordInputValue;
                user.passwordInputValue = null;
            }
            AdminService.updateUser(user)
                .then(response => {
                    console.info(response);
                    setDataSource((pre) => {
                        return pre.map((user) => {
                            if (user.username === response.username) {
                                return response;
                            } else {
                                return user;
                            }
                        });
                    });
                    form.resetFields();
                    resetUpdating();
                },
                    error => {
                        console.info(error);
                        let errorMessage = errorHandler(error);
                        setErrorMessage(errorMessage);
                    }
                );
        }
        return (
            <Modal
                visible={visible}
                title="Update user"
                okText="Save"
                cancelText="Cancel"
                onCancel={onCancel}
                onOk={() => {
                    form
                        .validateFields()
                        .then((values) => {
                            handleUpdateUser(values);
                        })
                        .catch((info) => {
                            console.log('Validate Failed:', info);
                        });
                }}
            >
                <Form
                    form={form}
                    layout="horizontal"
                    name="form_in_modal_update"
                    initialValues={editingUser}
                    validateTrigger="onSubmit"
                >
                    <div>
                        <Switch
                            checked={passwordInput}
                            onChange={(e) => setPasswordInput(e)}
                        />
                        <Form.Item label="Password" name="passwordInputValue">
                            <Input maxLength='40' disabled={!passwordInput} />
                        </Form.Item>
                    </div>
                    {usersRole == "ROLE_ADMIN" &&
                        <Form.Item label="Name" name="adminName" rules={[{ required: true, message: 'Please add a value!' }]}>
                            <Input maxLength='40' />
                        </Form.Item>
                    }
                    {usersRole == "ROLE_DOCTOR" &&
                        <Form.Item label="Name" name="doctorName" rules={[{ required: true, message: 'Please add a value!' }]}>
                            <Input maxLength='40' />
                        </Form.Item>
                    }
                    {usersRole == "ROLE_DOCTOR" &&
                        <Form.Item label="Specialty" name="specialty" rules={[{ required: true, message: 'Please add a value!' }]}>
                            <Input maxLength='40' />
                        </Form.Item>
                    }
                    {usersRole == "ROLE_PATIENT" &&
                        <Form.Item label="Name" name="patientName" rules={[{ required: true, message: 'Please add a value!' }]}>
                            <Input maxLength='40' />
                        </Form.Item>
                    }
                    <Form.Item label="Email" name={['contactDetails', 'email']} rules={[{ required: true, type: 'email', message: 'Please add an email!' }]}>
                        <Input maxLength='40' />
                    </Form.Item>
                    <Form.Item label="Phone" name={['contactDetails', 'phone']} rules={[{ required: true, message: 'Please add a value!' }]}>
                        <Input maxLength='40' />
                    </Form.Item>
                    <Form.Item label="Address" name={['contactDetails', 'address']} rules={[{ required: true, message: 'Please add a value!' }]}>
                        <Input maxLength='40' />
                    </Form.Item>
                </Form>
                {errorMessage &&
                    <Alert message={errorMessage} type="error" />
                }
            </Modal>
        );
    }

    const UserCreateForm = ({ visible, onCancel }) => {
        const [form] = Form.useForm();
        const [errorMessage, setErrorMessage] = useState(null);

        const handleAddUser = (user) => {
            AdminService.createUser(user)
                .then(response => {
                    console.info(response);
                    setDataSource((pre) => {
                        return [...pre, response];
                    });
                    form.resetFields();
                    setIsAdding(false);
                },
                    error => {
                        console.info(error);
                        let errorMessage = errorHandler(error);
                        setErrorMessage(errorMessage);
                    }
                );
        };
        return (
            <Modal
                visible={visible}
                title="Add new user"
                okText="Save"
                cancelText="Cancel"
                onCancel={onCancel}
                onOk={() => {
                    form
                        .validateFields()
                        .then((values) => {
                            handleAddUser(values);
                        })
                        .catch((info) => {
                            console.log('Validate Failed:', info);
                        });
                }}
            >
                <Form
                    form={form}
                    layout="horizontal"
                    name="form_in_modal_create"
                    validateTrigger="onSubmit"
                >
                    <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Please add a value!' }]}>
                        <Input maxLength='20' />
                    </Form.Item>
                    <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please add a value!' }]}>
                        <Input maxLength='40' />
                    </Form.Item>

                    {usersRole == "ROLE_ADMIN" &&
                        <Form.Item label="Name" name="adminName" rules={[{ required: true, message: 'Please add a value!' }]}>
                            <Input maxLength='40' />
                        </Form.Item>
                    }

                    {usersRole == "ROLE_DOCTOR" &&
                        <Form.Item label="Name" name="doctorName" rules={[{ required: true, message: 'Please add a value!' }]}>
                            <Input maxLength='40' />
                        </Form.Item>
                    }
                    {usersRole == "ROLE_DOCTOR" &&
                        <Form.Item label="Specialty" name="specialty" rules={[{ required: true, message: 'Please add a value!' }]}>
                            <Input maxLength='40' />
                        </Form.Item>
                    }

                    {usersRole == "ROLE_PATIENT" &&
                        <Form.Item label="Name" name="patientName" rules={[{ required: true, message: 'Please add a value!' }]}>
                            <Input maxLength='40' />
                        </Form.Item>
                    }
                    {usersRole == "ROLE_PATIENT" &&
                        <Form.Item label="Personal ID" name="personalIdentificationCode" rules={[{ required: true, message: 'Please add a value!' }]}>
                            <Input maxLength='40' />
                        </Form.Item>
                    }
                    {usersRole == "ROLE_PATIENT" &&
                        <Form.Item label="Sex" name="sex" rules={[{ required: true, message: 'Please add a value!' }]}>
                            <Select>
                                <Select.Option value="M">Male</Select.Option>
                                <Select.Option value="F">Female</Select.Option>
                            </Select>
                        </Form.Item>
                    }
                    {usersRole == "ROLE_PATIENT" &&
                        <Form.Item label="Birth date" name="birthDate" rules={[{ required: true, message: 'Please add a value!' }]}>
                            <DatePicker />
                        </Form.Item>

                    }
                    <Form.Item label="Email" name={['contactDetails', 'email']} rules={[{ required: true, type: 'email', message: 'Please add an email!' }]}>
                        <Input maxLength='40' />
                    </Form.Item>
                    <Form.Item label="Phone" name={['contactDetails', 'phone']} rules={[{ required: true, message: 'Please add a value!' }]}>
                        <Input maxLength='40' />
                    </Form.Item>
                    <Form.Item label="Address" name={['contactDetails', 'address']} rules={[{ required: true, message: 'Please add a value!' }]}>
                        <Input maxLength='40' />
                    </Form.Item>
                </Form>
                {errorMessage &&
                    <Alert message={errorMessage} type="error" />
                }
            </Modal>
        );
    };

    return (
        <div className="App">
            <header className="App-body">

                {usersRole == null && <h2 style={{ color: 'white' }}>User management board! Select the user type!</h2>}
                {usersRole == "ROLE_ADMIN" && <h2 style={{ color: 'white' }}>Admins management board!</h2>}
                {usersRole == "ROLE_DOCTOR" && <h2 style={{ color: 'white' }}>Doctors management board!</h2>}
                {usersRole == "ROLE_PATIENT" && <h2 style={{ color: 'white' }}>Patients management board!</h2>}

                <div>
                    Type of users:
                    <Select
                        placeholder="Select type"
                        onChange={onChangeUsersRole}
                        style={{
                            marginBottom: 15,
                            marginTop: 15,
                        }}
                    >
                        <Select.Option value="ROLE_ADMIN">Admin</Select.Option>
                        <Select.Option value="ROLE_DOCTOR">Doctor</Select.Option>
                        <Select.Option value="ROLE_PATIENT">Patient</Select.Option>
                    </Select>
                </div>

                {usersRole &&
                    <Table columns={getTableColumns()} dataSource={dataSource}></Table>
                }
                <UserUpdateForm
                    visible={isEditing}
                    onCancel={() => {
                        resetUpdating();
                    }}
                />

                {usersRole &&
                    <Button type="primary" onClick={() => { setIsAdding(true); }}>
                        {usersRole == "ROLE_ADMIN" && <>Add a new admin user.</>}
                        {usersRole == "ROLE_DOCTOR" && <>Add a new doctor user.</>}
                        {usersRole == "ROLE_PATIENT" && <>Add a new patient user.</>}
                    </Button>
                }

                <UserCreateForm
                    visible={isAdding}
                    onCancel={() => {
                        setIsAdding(false);
                    }}
                />
            </header>
        </div>
    );
}

export default UserManagementBoard;