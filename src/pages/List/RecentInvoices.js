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

const confirm = Modal.confirm;

const { Column, ColumnGroup } = Table;

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const SelectOption = Select.Option;
const { Search, TextArea } = Input;
const { Option } = Select;

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
  state = { visible: false, done: false, filteredInfo: null, sortedInfo: null, modal: '', id: '' };

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

  // onChange(value) {
  //   console.log(`selected ${value}`);
  // }

  // onBlur() {
  //   console.log('blur');
  // }

  // onFocus() {
  //   console.log('focus');
  // }

  // onSearch(val) {
  //   console.log('search:', val);
  // }

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
    window.location.href = '/corporate/recentinvoices';
  };

  handleSubmit = e => {
    console.log('test');
    e.preventDefault();
    const { dispatch, form, appuser } = this.props;
    const { id } = this.state;
    form.validateFields((err, fieldsValue) => {
      console.log(fieldsValue, id);
      const ponumber = fieldsValue.PoNumber;
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
      } else if (ponumber) {
        dispatch({
          type: 'rule/addPO',
          payload: { ...fieldsValue, id },
        });
      }
    });
  };

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
    const { appusers } = this.props.rule;
    const { recentInvoices } = this.props.rule;
    const data = recentInvoices.recentinvoices;
    const { po, department } = this.props.rule;
    const departments = recentInvoices.departments;
    const { user } = this.props;
    let { sortedInfo, filteredInfo } = this.state;
    const {
      form: { getFieldDecorator },
    } = this.props;
    let done;
    if (Object.keys(po).length > 0 || Object.keys(department).length > 0) {
      done = true;
    }
    const { visible, current = {}, modal } = this.state;
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
            title="Updated"
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
        title: 'Invoice Number',
        dataIndex: 'id',
        key: 'id',
        sorter: (a, b) => a.id.length - b.id.length,
        sortOrder: sortedInfo.columnKey === 'id' && sortedInfo.order,
      },
      {
        title: 'PO Number',
        dataIndex: 'po',
        key: 'po',
        sorter: (a, b) => a.po.length - b.po.length,
        sortOrder: sortedInfo.columnKey === 'po' && sortedInfo.order,
      },
      {
        title: 'Date',
        dataIndex: 'invoicedate',
        key: 'invoicedate',
        sorter: (a, b) => a.invoicedate.length - b.invoicedate.length,
        sortOrder: sortedInfo.columnKey === 'invoicedate' && sortedInfo.order,
      },
      {
        title: 'Customer Name',
        dataIndex: 'c_name',
        key: 'c_name',
        sorter: (a, b) => a.c_name.length - b.c_name.length,
        sortOrder: sortedInfo.columnKey === 'c_name' && sortedInfo.order,
      },
      {
        title: 'Amount',
        dataIndex: 'total.gtotal',
        key: 'total.gtotal',
        sorter: (a, b) => a.total.gtotal - b.total.gtotal,
        sortOrder: sortedInfo.columnKey === 'total.gtotal' && sortedInfo.order,
      },
      {
        title: 'Department',
        dataIndex: 'c_dep',
        key: 'c_dep',
      },
      {
        title: 'Action',
        key: 'action',
        dataIndex: '_id',
        render: (_id,row) => {
          const url = `/invoice/view/${_id}`;
          return (
            <span>
              <Button type="primary" size="small">
                <a href={url}>View invoice</a>
              </Button>
              <Divider type="vertical" />
              {!row.po && <Button type="primary" onClick={() => this.showModal(_id, 'po')} size="small">
                <a>Assign PO number</a>
                          </Button>}
              <Divider type="vertical" />
              {!row.c_dep && <Button type="primary" onClick={() => this.showModal(_id, 'dep')} size="small">
                <a>Assign Department</a>
                             </Button>}
            </span>
          );
        },
      },
    ];
    return (
      <div>
        <Table columns={columns} dataSource={data} onChange={this.handleChange} />
        <Modal
          title="Assign PO/Department"
          className={styles.standardListForm}
          width={640}
          bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {getModalContent()}
        </Modal>
      </div>
    );
  }
}

export default RecentInvoices;
