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
  Descriptions
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

@connect(({ rule, list, loading, appusers, appuser, user }) => ({
  list,
  appusers,
  rule,
  appuser,
  user,
  loading: loading.models.list,
}))
@Form.create()
class CustomerLedger extends PureComponent {
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
      rule,
    } = this.props;
    const { appusers } = this.props.rule;
    const { user } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { visible, done, current = {} } = this.state;


    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 5,
      total: 50,
    };
    
    return (
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
              <Descriptions.Item label="Name"></Descriptions.Item>
              <Descriptions.Item label="Balance"></Descriptions.Item>
              <Descriptions.Item label="Email"></Descriptions.Item>
              <Descriptions.Item label="Phone Number"></Descriptions.Item>
              <Descriptions.Item label="Designation">

              </Descriptions.Item>
              <Descriptions.Item label="Company"></Descriptions.Item>
            </Descriptions>
          </Card>
        </div>

        <div>
          <Table dataSource={appusers}>
            <Column title="Invoice ID" dataIndex="id" key="barcode" />
            <Column title="Summary" dataIndex="sum" key="name" />

            <Column
              title="Date"
              dataIndex="date"
              key="valid"
            />
            <Column title="Time" dataIndex="time" key="bactiveSlots" />
            <Column title="Debit" dataIndex="debit" key="number" />
            <Column title="Credit" dataIndex="credit" key="number" />
            <Column title="tds" dataIndex="tds" key="number" />
            <Column title="Balance" dataIndex="balanc" key="number" />
            <Column title="Action" key="Action" />
          </Table>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default CustomerLedger;
