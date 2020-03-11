import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import moment from 'moment';
import { connect } from 'dva';
import {
  Tabs,
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
} from 'antd';
const TabPane = Tabs.TabPane;
const { Column, ColumnGroup } = Table;
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Result from '@/components/Result';

import styles from './Contracts.less';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const SelectOption = Select.Option;
const { Search, TextArea } = Input;

@connect(({ rule, list, loading, appusers, appuser, user }) => ({
  list,
  appusers,
  rule,
  appuser,
  user,
  loading: loading.models.list,
}))
@Form.create()
class BasicList extends PureComponent {
  state = { visible: false, done: false };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
      payload: {
        count: 5,
      },
    });
  }

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
      this.setState({
        done: true,
      });
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
  callback = key => {
    console.log(key);
  };

  render() {
    const {
      list: { list },
      loading,
      rule,
    } = this.props;
    const { appusers } = this.props.rule;
    const { user } = this.props;
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
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title=""
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
          >
            <Tabs onChange={this.callback} type="card">
              <TabPane tab="Ongoing" key="1">
                <div>
                  <Table>
                    <Column title="Contract ID" dataIndex="barcode" key="barcode" />
                    <Column title="Supplier Name" dataIndex="name" key="name" />

                    <Column
                      title="Valid Till"
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
                    <Column title="Category" dataIndex="activeSlots" key="bactiveSlots" />
                    <Column title="Actions" key="Action" />
                  </Table>
                </div>
                <Modal
                  title={'Add Customer'}
                  className={styles.standardListForm}
                  width={640}
                  bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
                  destroyOnClose
                  visible={visible}
                  {...modalFooter}
                >
                  {getModalContent()}
                </Modal>
              </TabPane>
              <TabPane tab="Expired" key="2">
                Content of Tab Pane 2
              </TabPane>
              <TabPane tab="Cancelled" key="3">
                Content of Tab Pane 3
              </TabPane>
            </Tabs>
          </Card>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default BasicList;
