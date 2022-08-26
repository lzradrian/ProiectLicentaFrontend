import { Button, Checkbox, Form, InputNumber, Space, Select, Popover } from 'antd';
import { MinusCircleOutlined, PlusOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useState } from "react";
import DoctorService from './doctor.service'

const { Option } = Select;

function DoctorPredictionBoard() {

    const [componentDisabled, setComponentDisabled] = useState(false);

    const [resultMessage, setResultMessage] = useState();

    const [form] = Form.useForm();

    const content = (
        <div>
            <p>In case of diabetic relative, the input age should be when diabetes was diagnosed</p>
            <p>Otherwise, the input age should be when last non-diabetic examination took place</p>
        </div>
    );

    const onFinish = (values) => {
        DoctorService.makeDiabetesPrediction(values)
            .then(
                response => {
                    setResultMessage(response)
                },
                error => {
                    setResultMessage(error)
                }
            );
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="App">
            <div className="App-body">

                <h2 style={{ color: 'white', marginBottom: '20px' }}>Diabetes prediction board!</h2>

                <Form
                    form={form}
                    name="basic"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item name="glucose"
                        rules={[{ required: true, message: 'Please add a value!' }]}
                    >
                        <InputNumber addonBefore="Glucose" min={40} max={200} />
                    </Form.Item>

                    <Form.Item name="weight"
                        rules={[{ required: true, message: 'Please add a value!' }]}
                    >
                        <InputNumber addonBefore="Weight" min={30} max={300} />
                    </Form.Item>

                    <Form.Item name="height"
                        rules={[{ required: true, message: 'Please add a value!' }]}
                    >
                        <InputNumber addonBefore="Height" min={50} max={250} />
                    </Form.Item>

                    <Form.Item name="age"
                        rules={[{ required: true, message: 'Please add a value!' }]}
                    >
                        <InputNumber addonBefore="Age" min={0} max={120} />
                    </Form.Item>

                    <Checkbox
                        checked={componentDisabled}
                        onChange={(e) => setComponentDisabled(e.target.checked)}
                        style={{ color: 'white' }}
                    >
                        Calculate diabetes pedigree based on relatives information
                    </Checkbox>

                    {!componentDisabled &&
                        <Form.Item name="diabetesPedigreeFunction"
                            rules={[{ required: true, message: 'Please add a value!' }]}
                            style={{ marginTop:10 }}
                        >
                            <InputNumber addonBefore="Diabetes pedigree" min={0} max={1.12} />
                        </Form.Item>
                    }

                    {componentDisabled &&
                        <div>
                            <Popover content={content} title="Age input info">
                                <Button style={{
                                                marginBottom: 20,
                                                marginTop: 10,
                                            }}>
                                Read before completing!
                                <InfoCircleOutlined style={{ fontSize: '15px', color: 'red' }}  ></InfoCircleOutlined>
                                </Button>
                            </Popover>
                        </div>
                    }

                    {componentDisabled &&
                        <Form.List name="relativesInfoList" >
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
                                                name={[name, 'degree']}
                                                rules={[{ required: true, message: "Please add a value!" }]}
                                            >
                                                <Select placeholder="Select relative degree">
                                                    <Option value="1">Parent or full sibling</Option>
                                                    <Option value="2">Half sibling, grandparent, uncle or aunt</Option>
                                                    <Option value="3">Half aunt, half uncle or first cousin</Option>
                                                </Select>
                                            </Form.Item>

                                            <Form.Item
                                                {...restField}
                                                name={[name, 'age']}
                                                rules={[{ required: true, message: 'Please add a value!' }]}
                                            >
                                                <InputNumber placeholder="Age" min={14} max={88} />
                                            </Form.Item>

                                            <Form.Item
                                                {...restField}
                                                name={[name, 'diabetic']}
                                                rules={[{ required: true, message: 'Please add a value!' }]}
                                            >
                                                <Select placeholder="Select diabetic status">
                                                    <Option value="true">Is diabetic</Option>
                                                    <Option value="false">Not diabetic</Option>
                                                </Select>
                                            </Form.Item>

                                            <MinusCircleOutlined style={{ color: 'red' }} onClick={() => remove(name)} />
                                        </Space>
                                    ))}
                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            Add relative info
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    }
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>

                    <Form.Item>
                        <Button onClick={e => {
                            form.resetFields();
                            setResultMessage(null);
                        }} >Clear fields</Button>
                    </Form.Item>
                </Form>


                {resultMessage &&
                    <p>Result: {resultMessage}</p>
                }
            </div>
        </div>
    )
}

export default DoctorPredictionBoard;