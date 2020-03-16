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
  state = { visible: false, done: false , expandIconPosition: 'left', category: "", tariff:{}
};

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  componentDidMount() {
    const { dispatch,user } = this.props;
    const vendorId = user.currentUser.id
    dispatch({
      type: 'rule/tariff',
      payload: {
        vendorId,
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

  showModal = (item) => {
    this.setState({
      visible: true,
      category: item.category,
      tariff:item,
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
    const { dispatch } = this.props;
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      done: false,
      visible: false,
    });
    dispatch({
      type: 'rule/closeSuccessPop'
    });
  };

  handleCancel = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      visible: false,
    });
  };

  inputChange = (e,type) => {
    const tariffData = this.state.tariff;
    tariffData[type] = Number(e.target.value);
    this.setState({
      tariff: tariffData,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form, appuser } = this.props;
    const { current } = this.state;
    setTimeout(() => this.addBtn.blur(), 0);
    dispatch({
      type: 'rule/editTariff',
      payload: this.state.tariff,
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
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { visible, done, current = {}, tariff } = this.state;

    const modalFooter = rule.formSubmit === "success"
      ? { footer: null, onCancel: this.handleDone }
      : { okText: 'Submit', onOk: this.handleSubmit, onCancel: this.handleCancel };

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 5,
      total: 50,
    };
    const getModalContent = (tarr) => {

      if (rule.formSubmit === "success") {
        return (
          <Result
            type="success"
            title="Edited"
            description="Tariff Updated Successfully"
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
          <Form.Item label="RatePerKM" {...this.formLayout}>
          <Input placeholder="Enter RatePerKM" defaultValue={tarr.rate_per_km} onChange={(e)=>this.inputChange(e,"rate_per_km")} />
            {/* {getFieldDecorator('RatePerKM', {
              rules: [
                {
                  required: true,
                  message: 'RatePerKM is required!',
                },
              ],
              initialvalue: tarr.rate_per_km,
            })(<Input placeholder="Enter RatePerKM" defaultValue="5" />)} */}
          </Form.Item>
        </Form>
      );
    };
    return (
      <PageHeaderWrapper>
        <Card title="Card Title">
          {rule.tariffList.map(item => (
            <Card.Grid style={gridStyle}>  
              <Card
                style={{ width: 300 }}
                cover={
                  <img
                    alt="example"
                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                  />
            }
                actions={[
                  // <SettingOutlined key="setting" />,
              <EditOutlined key="edit" onClick={()=> this.showModal(item)}  />,
                  // <EllipsisOutlined key="ellipsis" />,
            ]}
              >
                <Meta
                  title={item.category}
                />
                <span>jsfskf</span>
              </Card>
            </Card.Grid>
    ))}
        </Card>
        <Modal
          className={styles.standardListForm}
          width={640}
          bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {getModalContent(tariff)}
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default BasicList;
