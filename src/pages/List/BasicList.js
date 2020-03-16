import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import moment from 'moment';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';

import { connect } from 'dva';
import {
  List,
  Card,
  Row,
  Col,
  Table,
  Divider,
  Tag,
  Radio,
  Input,
  Progress,
  Button,
  Icon,
  Dropdown,
  Menu,
  Avatar,
  Modal,
  Form,
  DatePicker,
  Select,
  Collapse,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Result from '@/components/Result';

import styles from './BasicList.less';

const { Column, ColumnGroup } = Table;

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const SelectOption = Select.Option;
const { Search, TextArea } = Input;

const { Panel } = Collapse;
const { Option } = Select;
const { Meta } = Card;

function callback(key) {
  console.log(key);
}

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const gridStyle = {
  width: '300',
  textAlign: 'center',
};
const genExtra = () => (
  <SettingOutlined
    onClick={event => {
      // If you don't want click extra trigger collapse, you can prevent this:
      event.stopPropagation();
    }}
  />
);

@connect(({ rule, list, loading, appusers, appuser, user,currentUser }) => ({
  list,
  appusers,
  rule,
  appuser,
  currentUser,
  user,
  loading: loading.models.list,
}))
@Form.create()
class BasicList extends PureComponent {
  state = { visible: false, done: false , expandIconPosition: 'left'
};

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/tariff',
      payload: {
        count: 5,
      },
    });
    dispatch({
      type: 'rule/fetch',
      payload: {
        count: 5,
      },
    });
  }

  onPositionChange = expandIconPosition => {
    this.setState({ expandIconPosition });
  };

  showModal = () => {
    this.setState({
      visible: true,
      current: undefined,
    });
  };

  showEditModal = item => {
    this.setState({
      visible: true,
      current: item,
    });
  };

  handleDone = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      done: false,
      visible: false,
    });
  };

  handleCancel = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      visible: false,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form, appuser } = this.props;
    const { current } = this.state;
    setTimeout(() => this.addBtn.blur(), 0);
    form.validateFields((err, fieldsValue) => {
      console.log(fieldsValue);
      if (err) return;
      // this.setState({
      //   done: true,
      // });
      dispatch({
        type: 'rule/add',
        payload: { ...fieldsValue },
      });
    });
  };

  deleteItem = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'list/submit',
      payload: { id },
    });
  };

  render() {
    const {
      list: { list },
      loading,
      rule
    } = this.props;
    const { expandIconPosition } = this.state;
    const { appusers } = this.props.rule;
    const { user } = this.props;
    console.log(user)

    const {
      form: { getFieldDecorator },
    } = this.props;
    const { visible, done, current = {} } = this.state;

    const modalFooter = done
      ? { footer: null, onCancel: this.handleDone }
      : { okText: 'Submit', onOk: this.handleSubmit, onCancel: this.handleCancel };

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 5,
      total: 50,
    };
    const getModalContent = () => {
      if (done) {
        return (
          <Result
            type="success"
            title="Added"
            description="New Customer Created Successfully"
            actions={
              <Button type="primary" onClick={this.handleDone}>
                Close
              </Button>
            }
            className={styles.formResult}
          />
        );
      }
      return (
        <Form onSubmit={this.handleSubmit}>
          <Form.Item label="Name" {...this.formLayout}>
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: 'Name is required!',
                },
              ],
              initialvalue: current.name,
            })(<Input placeholder="Enter Name" />)}
          </Form.Item>
          <FormItem label="Phone Number" {...this.formLayout}>
            {getFieldDecorator('number', {
              rules: [{ required: true, message: 'Phone number is required' }],
              initialvalue: current.number,
            })(<Input placeholder="Enter Phone Number" />)}
          </FormItem>
          <Form.Item label="Room No" {...this.formLayout}>
            {getFieldDecorator('room', {
              rules: [
                {
                  required: true,
                  message: 'Room No is required!',
                },
              ],
              initialvalue: current.room,
            })(<Input placeholder="Enter Room No" />)}
          </Form.Item>
          <FormItem label="Roll" {...this.formLayout}>
            {getFieldDecorator('roll', {
              rules: [{ required: true, message: 'Roll No is required' }],
              initialvalue: current.roll,
            })(<Input placeholder="Enter Roll No" />)}
          </FormItem>
        </Form>
      );
    };
    return (
      <PageHeaderWrapper>
        <Card title="Card Title">
    <Card.Grid style={gridStyle}>  <Card
    style={{ width: 300 }}
    cover={
      <img
        alt="example"
        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
      />
    }
    actions={[
      <SettingOutlined key="setting" />,
      <EditOutlined key="edit" />,
      <EllipsisOutlined key="ellipsis" />,
    ]}
  >
    <Meta
      avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
      title="Card title"
      description="This is the description"
    />
  </Card></Card.Grid>
    <Card.Grid hoverable={false} style={gridStyle}>
    <Card
    style={{ width: 300 }}
    cover={
      <img
        alt="example"
        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
      />
    }
    actions={[
      <SettingOutlined key="setting" />,
      <EditOutlined key="edit" />,
      <EllipsisOutlined key="ellipsis" />,
    ]}
  >
    <Meta
      avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
      title="Card title"
      description="This is the description"
    />
  </Card>
    </Card.Grid>
    <Card.Grid style={gridStyle}><Card
    style={{ width: 300 }}
    cover={
      <img
        alt="example"
        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
      />
    }
    actions={[
      <SettingOutlined key="setting" />,
      <EditOutlined key="edit" />,
      <EllipsisOutlined key="ellipsis" />,
    ]}
  >
    <Meta
      avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
      title="Card title"
      description="This is the description"
    />
  </Card></Card.Grid>
    <Card.Grid style={gridStyle}>Content</Card.Grid>
    <Card.Grid style={gridStyle}>Content</Card.Grid>
    <Card.Grid style={gridStyle}>Content</Card.Grid>
    <Card.Grid style={gridStyle}>Content</Card.Grid>
  </Card>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title="Customer List"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
          >
            <Button
              type="dashed"
              style={{ width: '25%', marginBottom: 8 }}
              icon="plus"
              onClick={this.showModal}
              ref={component => {
                /* eslint-disable */
                this.addBtn = findDOMNode(component);
                /* eslint-enable */
              }}
            >
              Add New Customer
            </Button>
          </Card>
        </div>

        <div>
          <Table dataSource={appusers}>
            <Column
              title="Barcode ID"
              dataIndex="barcode"
              key="barcode"
              render={barcode => {
                if (!barcode) return <Tag color="red">Not Added</Tag>;
                return (
                  <span>
                    <Tag color="blue">{barcode}</Tag>
                  </span>
                );
              }}
            />
            <Column title="Name" dataIndex="name" key="name" />

            <Column
              title="Valid Upto"
              dataIndex="valid"
              key="valid"
              render={valid => {
                if (!valid) return <Tag color="red">No Validity</Tag>;
                return (
                  <span>
                    <Tag color="blue">
                      {moment(valid[user.currentUser.site]).format('YYYY-MM-DD HH:mm')}
                    </Tag>
                  </span>
                );
              }}
            />
            <Column title="Slot" dataIndex="activeSlots" key="bactiveSlots" />
            <Column title="Number" dataIndex="number" key="number" />
            <Column title="Action" key="Action" />
          </Table>
        </div>
        <Modal
          title="Add Customer"
          className={styles.standardListForm}
          width={640}
          bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {getModalContent()}
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default BasicList;
