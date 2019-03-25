import React, { Component } from 'react';
import { connect } from "react-redux";

import { Table, Input, Button, Popconfirm, Form, Divider, InputNumber, } from 'antd';

import { fetchContacts, deleteContact, createContact, updateContact } from "../actions/contactActions";

const FormItem = Form.Item;
const EditableContext = React.createContext();

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      ...restProps
    } = this.props;
    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [{
                      required: true,
                      message: 'Please Input ' + title
                    }],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}

class ContactsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], editingKey: ''
    };

    this.isEditing = record => record.key === this.state.editingKey;

    this.columns = [
      { title: 'Name', dataIndex: 'firstName', key: 'firstName', editable: true, },
      { title: 'Last Name', dataIndex: 'lastName', key: 'lastName', editable: true, },
      { title: 'Company', dataIndex: 'company', key: 'company', editable: true, },
      { title: 'Phone Number', dataIndex: 'phoneNumber', key: 'phoneNumber', editable: true, },
      { title: 'Email', dataIndex: 'email', key: 'email', editable: true, },
      {
        title: 'Action', key: 'action',
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return (
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a
                        href="javascript:;"
                        onClick={() => { this.save(form, record.key) }}
                        style={{ marginRight: 8 }}
                      >
                        Save
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm
                    title="Sure to cancel?"
                    onConfirm={() => this.cancel(record.key)}
                  >
                    <a href="javascript:;">Cancel</a>
                  </Popconfirm>
                </span>
              ) : (
                  <a href="javascript:;" disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>Edit</a>
                )}
              <Divider type="vertical" />
              <Popconfirm title="Sure to delete?" onConfirm={() => this.onContactDelete(record._id)}>
                <a href="javascript:;">Delete</a>
              </Popconfirm>
            </div>
          )
        }


      }
    ];
  }

  edit(key) {
    this.setState({ editingKey: key });
  }

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  componentWillMount() {
    const { dispatch, contactsPager } = this.props;

    dispatch(fetchContacts({ pager: contactsPager }));
  }

  onPagerChange = (page, pageSize) => {
    const { dispatch } = this.props;

    this.setState({ editingKey: '' });
    dispatch(fetchContacts({ pager: { page } }));
  }

  onContactDelete(id) {
    const { dispatch } = this.props;

    dispatch(deleteContact(id));
  }

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) return;

      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);

      if (index > -1) {
        const id = newData[index]._id;

        this.props.dispatch(updateContact({ id, contact: row })).then(() => {
          this.setState({ editingKey: '' });
        });
      } else {
        this.props.dispatch(createContact(row)).then(() => {
          this.setState({ editingKey: '' });
        });
      }
    });
  }

  componentDidUpdate(prevProps) {
    const { contacts } = this.props;
    if (prevProps.contacts != contacts) {
      this.setState({
        data: contacts.map((contact, index) => {
          return Object.assign({}, contact, { key: index.toString() });
        })
      });
    }
  }

  render() {
    const { contactsPager, isFetching, contacts } = this.props;
    const { data } = this.state;


    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    return (
      <EditableContext.Provider value={this.props.form}>
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ ...contactsPager, onChange: this.onPagerChange }}
          loading={isFetching}
          components={components}
          rowClassName="editable-row"
        />
      </EditableContext.Provider>
    );
  }
}

const mapStateToProps = state => {
  return {
    contacts: state.contacts,
    contactsPager: state.pager
  };
};

const WrapedContactsTable = Form.create()(ContactsTable);


export default connect(mapStateToProps)(WrapedContactsTable);
