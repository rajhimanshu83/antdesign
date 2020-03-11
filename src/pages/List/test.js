import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import moment from 'moment';
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

@connect(({ rule, list, loading, appusers, appuser, user, recentInvoices }) => ({
  list,
  appusers,
  rule,
  appuser,
  user,
  recentInvoices,
  loading: loading.models.list,
}))
@Form.create()
class RecentInvoices extends PureComponent {
  state = { visible: false, done: false, filteredInfo: null, sortedInfo: null };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetchInvoices',
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

  render() {
    const {
      list: { list },
      loading,
      rule,
    } = this.props;
    const { appusers } = this.props.rule;
    const { recentInvoices } = this.props.rule;

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
            title="Recent Invoices"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 2px 4px 3px' }}
          />
        </div>

        <div>
          <Table dataSource={recentInvoices}>
            <Column title="Invoice No" dataIndex="id" key="barcode" />
            <Column title="PO Number" dataIndex="name" key="name" />

            <Column
              title="Date"
              dataIndex="invoicedate"
              key="date"
              render={date => {
                if (!date) return <Tag color="red">No Date</Tag>;
                return (
                  <span>
                    <Tag color="blue">{moment(date).format('YYYY-MM-DD')}</Tag>
                  </span>
                );
              }}
            />
            <Column title="Customer Name" dataIndex="c_name" key="c_name" />
            <Column title="Amount" dataIndex="total.gtotal" key="number" />
            <Column title="Department" dataIndex="number" key="number" />
            <Column
              title="Action"
              key="Action"
              render={() => {
                return (
                  <div>
                    <Button size="small" block>
                      Assign PO number
                    </Button>
                    <Button size="small" block>
                      Assign Department
                    </Button>
                    <Button size="small" block>
                      View invoice
                    </Button>
                  </div>
                );
              }}
            />
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

export default RecentInvoices;
