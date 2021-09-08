import React, { useState } from 'react';
import { Button, Modal, Form, Input, } from 'antd';
import CollapseDropDown from './CollapseDropDown';
import './App.css';
import MoreChoices from './MoreChoices';


 const CollectionCreateForm = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();


  return (
    <Modal 
      visible={visible}
      title="Create Poll"
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
        <Form.Item
          name="question"
          label="Question"
          rules={[
            {
              required: true,
              message: '*Question field is required.',
            },
          ]}
        ><div className="question-input">        
              <Input style={{width:'90%'}}/>
        </div>
        </Form.Item>
        <Form.Item>
          <p>Choices</p>
          </Form.Item>
           <MoreChoices/>
           <CollapseDropDown/>
      </Form>
    </Modal>
  );
};

const CollectionsPage = () => {
  const [visible, setVisible] = useState(false);

  const onCreate = (values) => {
    console.log('Received values of form: ', values);
    setVisible(false);
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setVisible(true);
        }}
      >
        Poll
      </Button>
      <CollectionCreateForm
        visible={visible}
        onCreate={onCreate}
        onCancel={() => {
          setVisible(false);
        }}
      />
    </div>
  );
};
export default CollectionsPage;
