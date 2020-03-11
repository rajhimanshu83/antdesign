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
  Descriptions,
  Badge
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Result from '@/components/Result';

import styles from './BasicList.less';

const confirm = Modal.confirm;

const { Column, ColumnGroup } = Table;

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const SelectOption = Select.Option;
const { Search, TextArea } = Input;
const { Option } = Select;

@connect(({ rule, list, loading, appusers, appuser, user, recentInvoices, customers ,customerLedger,customerProfile}) => ({
  list,
  appusers,
  rule,
  appuser,
  user,
  recentInvoices,
  customers,
  customerProfile,
  loading: loading.models.list,
  customerLedger
}))
@Form.create()
class RecentInvoices extends PureComponent {
  state = { visible: false, done: false, filteredInfo: null, sortedInfo: null, modal: '', id: '',custLed:false, custprofile:false };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetchCustomers',
      payload: {
        count: 5,
      },
    });
  }

  showModal = (_id, actype) => {
    this.setState({
      visible: true,
      current: undefined,
      id: _id,
      modal: actype,
    });
  };

  handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleDone = () => {
    this.setState({
      done: false,
      visible: false,
    });
  };

  handleSubmit = e => {
    console.log('test');
    e.preventDefault();
    const { dispatch, form, appuser } = this.props;
    const { id } = this.state;
    form.validateFields((err, fieldsValue) => {
      console.log(fieldsValue, id);
      const po = fieldsValue.PoNumber;
      const dept = fieldsValue.Department;
      if (err) return;
      // this.setState({
      //   done: true,
      // });
      if (dept) {
        dispatch({
          type: 'rule/addDepartment',
          payload: { ...fieldsValue, id },
        });
      } else if (po) {
        dispatch({
          type: 'rule/addPO',
          payload: { ...fieldsValue, id },
        });
      }
    });
  };

  getCustLedger=(_id)=>{
    const id = _id;
    const { dispatch } = this.props;
   if(id){
    dispatch({
      type: 'rule/custLedger',
      payload: {id},
    });
   }
   setTimeout(() =>  this.setState({
    custLed: true,
  }), 1000);
  }

  getCustProfile=(_id)=>{
    const id = _id;
    const { dispatch } = this.props;
   if(id){
    dispatch({
      type: 'rule/fetchcustomerProfile',
      payload: {id},
    });
   }
   setTimeout(() =>  this.setState({
    custprofile: true,
  }), 1000);
  }

  clearFilters = () => {
    this.setState({ filteredInfo: null });
  };

  clearAll = () => {
    this.setState({
      filteredInfo: null,
      sortedInfo: null,
    });
  };

  setAgeSort = () => {
    this.setState({
      sortedInfo: {
        order: 'descend',
        columnKey: 'age',
      },
    });
  };

  render() {
    const {
      list: { list },
      loading,
      rule,
    } = this.props;
    const { customers } = this.props.rule;
    const { recentInvoices } = this.props.rule;
    const data = customers.customers;
    const {customerLedger} = this.props.rule;
    const {customerProfile} = this.props.rule;
    const {userDetail,transactions} = customerLedger;
    const customerDetail = customerProfile.userDetail;
    const { po, department } = this.props.rule;
    const departments = recentInvoices.departments;
    const { user } = this.props;
    let { sortedInfo, filteredInfo } = this.state;
    const {
      form: { getFieldDecorator },
    } = this.props;
    let done;
    if (po && department) {
      done = false;
    }
    const { visible, current = {}, modal, custLed ,custprofile} = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const modalFooter = done
      ? { footer: null, onCancel: this.handleDone }
      : { okText: 'Submit', onOk: this.handleSubmit, onCancel: this.handleCancel };
    const getModalContent = () => {
      if (done) {
        return (
          <Result
            type="success"
            title="Added"
            description="Invoice Updated Successfully"
            actions={
              <Button type="primary" onClick={this.handleDone}>
                Close
              </Button>
            }
            className={styles.formResult}
          />
        );
      }
      if (modal === 'dep') {
        return (
          <Form onSubmit={this.saveDepartment}>
            <FormItem label="Department" {...this.formLayout}>
              {getFieldDecorator('Department', {
                rules: [{ required: true, message: 'Department is required' }],
                initialvalue: current.department,
              })(
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Select Department"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {departments.map(department => (
                    <Option value={department.name}>{department.name}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Form>
        );
      }
      return (
        <Form onSubmit={this.saveDepartment}>
          <FormItem label="PO Number" {...this.formLayout}>
            {getFieldDecorator('PoNumber', {
              rules: [{ required: true, message: 'PO number is required' }],
              initialvalue: current.ponumber,
            })(<Input placeholder="Enter PO Number" />)}
          </FormItem>
        </Form>
      );
    };
    const columns = [
      {
        title: 'Customer Name',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.c_name.length - b.c_name.length,
        sortOrder: sortedInfo.columnKey === 'c_name' && sortedInfo.order,
      },
      {
        title: 'Amount due',
        dataIndex: 'balance',
        key: 'balance',
        sorter: (a, b) => a.total.gtotal - b.total.gtotal,
        sortOrder: sortedInfo.columnKey === 'total.gtotal' && sortedInfo.order,
      },
      {
        title: 'Department',
        dataIndex: 'department',
        key: 'department',
      },
      {
        title: 'Action',
        dataIndex: '_id',
        key: '_id',
        render: (_id,row) => {
         const url = `/customer/view/${_id}`;
          return (
            <span>
              <Button type="primary" size="small" onClick={() => this.getCustProfile(_id)}>
                <a>User Profile</a>
              </Button>
              <Divider type="vertical" />
              <Button type="primary" size="small" onClick={() => this.getCustLedger(_id)}>
                <a>Ledger</a>
              </Button>
            </span>
          );
        },
      },
    ];

    const ledgercolumns = [
      {
        title: 'Invoice ID',
        dataIndex: 'id',
        key: 'id',
        sorter: (a, b) => a.id.length - b.id.length,
        sortOrder: sortedInfo.columnKey === 'id' && sortedInfo.order,
      },
      {
        title: 'Summary',
        key: 'balance',
        dataIndex: 'total',
        render: (total,row) => {
           return (
             <span>&#8377;
               {`${total.gtotal  } has been credited` }
             </span>
           );
         },
      },
      {
        title: 'Date',
        dataIndex: 'invoicedate',
        key: 'invoicedate',
      },
      {
        title: 'Time',
        dataIndex: 'invoiceTime',
        key: 'invoiceTime',
      },
      {
        title: 'Credit',
        dataIndex: 'total',
        key: 'total',
        render: (total) => {
          return (
            <span>
              {total.gtotal || 0 }
            </span>
          );
        },
      },
      {
        title: 'Debit',
        dataIndex: 'debit',
        key: 'debit',
        render: (debit) => {
          return (
            <span>
              {debit || 0 }
            </span>
          );
        },
      },
      {
        title: 'tds',
        dataIndex: 'tds',
        key: 'tds',
        render: (tds) => {
          return (
            <span>
              {tds || 0 }
            </span>
          );
        },
      },
      {
        title: 'Balance',
        dataIndex: 'c_balance',
        key: 'c_balance',
        sorter: (a, b) => a.c_balance - b.c_balance,
        sortOrder: sortedInfo.columnKey === 'c_balance' && sortedInfo.order,
      },
      {
        title: 'Action',
        dataIndex: '_id',
        key: '_id',
        render: (_id,row) => {
         const url = `/customer/view/${_id}`;
          return (
            <span>
              <Button type="primary" size="small">
                <a>Order Summary</a>
              </Button>
            </span>
          );
        },
      },
    ];
    if(!custLed && !custprofile){
      return (
        <div>
          <Table columns={columns} dataSource={data} onChange={this.handleChange} />
        </div>
      );
    }
    if(custLed && userDetail){
      return(
        <PageHeaderWrapper>
          <div className={styles.standardList}>
            <Card
              className={styles.listCard}
              bordered={false}
              title="Customer Order History"
              style={{ marginTop: 24 }}
              bodyStyle={{ padding: '0 32px 40px 32px' }}
            >
              <Descriptions>
                <Descriptions.Item label="Name">{userDetail.name}</Descriptions.Item>
                <Descriptions.Item label="Balance">{userDetail.balance}</Descriptions.Item>
                <Descriptions.Item label="Email">{userDetail.email}</Descriptions.Item>
                <Descriptions.Item label="Phone Number">{userDetail.number}</Descriptions.Item>
                <Descriptions.Item label="Designation">{userDetail.designation}</Descriptions.Item>
                <Descriptions.Item label="Company">{userDetail.company}</Descriptions.Item>
              </Descriptions>
            </Card>
          </div>
  
          <div>
            <Table columns={ledgercolumns} dataSource={transactions} onChange={this.handleChange} />
          </div>
        </PageHeaderWrapper>
      );
    }
    if(custprofile && customerDetail){
      return(
        <PageHeaderWrapper>
          <div className={styles.standardList}>
            <Card
              className={styles.listCard}
              bordered={false}
              style={{ marginTop: 24 }}
              bodyStyle={{ padding: '0 32px 40px 32px' }}
            >
              <Avatar shape="square" size={64} icon="user" />
              <Descriptions title="Customer Info" bordered>
                <Descriptions.Item label="Name">{customerDetail.name}</Descriptions.Item>
                <Descriptions.Item label="Email">{customerDetail.email}</Descriptions.Item>
                <Descriptions.Item label="Number">{customerDetail.number}</Descriptions.Item>
                <Descriptions.Item label="Department">{customerDetail.department}</Descriptions.Item>
                <Descriptions.Item label="Company">{customerDetail.company}</Descriptions.Item>
                <Descriptions.Item label="GST">{customerDetail.gstin || "-"}</Descriptions.Item>
                <Descriptions.Item label="Employee ID">{customerDetail._id}</Descriptions.Item>
                <Descriptions.Item label="Designation">{customerDetail.designation}</Descriptions.Item>
                <Descriptions.Item label="Balance">{customerDetail.balance}</Descriptions.Item>
                <Descriptions.Item label="Credit Limit">{customerDetail.pterm}</Descriptions.Item>
                <Descriptions.Item label="Payment Term(days)">{customerDetail.creditlimit}</Descriptions.Item>
              </Descriptions>
            </Card>
          </div>
        </PageHeaderWrapper>
      );
    }
    
   
  }
}

export default RecentInvoices;
