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
      contacts: [],
      editingKey: ''
    };

    this.isEditing = record => {
      return record.key === this.state.editingKey
    };

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
                      <a href="javascript:;" style={{ marginRight: 8 }} onClick={() => { this.save(form, record.key) }}>
                        Save
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm
                    title="Sure to cancel?"
                    onConfirm={() => record.key > -1 ? this.cancel(record.key) : this.removeNewContactRow()}
                  >
                    <a href="javascript:;">Cancel</a>
                  </Popconfirm>
                </span>
              ) : (
                  <span>
                    <a href="javascript:;" disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>Edit</a>
                    <Divider type="vertical" />
                    <Popconfirm title="Sure to delete?" onConfirm={() => this.onContactDelete(record._id)}>
                      <a disabled={editingKey !== ''} href="javascript:;">Delete</a>
                    </Popconfirm>
                  </span>
                )}
            </div>
          )
        }
      }
    ];
  }

  componentWillMount() {
    const { dispatch, contactsPager } = this.props;

    dispatch(fetchContacts({ pager: contactsPager }));
  }

  componentDidUpdate(prevProps) {
    const { contacts } = this.props;
    if (prevProps.contacts != contacts) {
      const contactsWhitKeys = contacts.map((contact, index) => {
        return Object.assign({}, contact, { key: index.toString() });
      });
      this.setState({ contacts: contactsWhitKeys, editingKey: '' });
    }
  }

  edit(key) {
    this.setState({ editingKey: key });
  }

  cancel = () => {
    this.setState({ editingKey: '' });
  };

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
    form.validateFields((error, contact) => {
      if (error) return;

      const { contacts: data } = this.state;

      if (key > -1) {
        this.props.dispatch(updateContact({ contact, id: data.find(ds => ds.key === key)._id }));
      } else {
        this.props.dispatch(createContact(contact));
      }
    });
  }

  addNewContactRow = () => {
    const { contacts } = this.state;
    const newData = {
      key: -1,
      firstName: '',
      lastName: '',
      company: '',
      phoneNumber: '',
      email: ''
    };
    this.setState({
      contacts: [newData, ...contacts],
      editingKey: -1
    });
  }

  removeNewContactRow = () => {
    const { contacts } = this.state;
    this.setState({
      contacts: contacts.filter(ds => ds.key !== - 1),
      editingKey: ''
    });
  }

  render() {
    const { contactsPager, isFetching } = this.props;
    const { contacts, editingKey } = this.state;

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

    const components = {
      body: {
        cell: EditableCell,
      },
    };

    return (
      <div>
        <Button disabled={editingKey !== ''} onClick={this.addNewContactRow} type="primary" style={{ marginBottom: 16 }}>
          Add Contact
        </Button>
        <EditableContext.Provider value={this.props.form}>
          <Table
            columns={columns}
            dataSource={contacts}
            pagination={{ ...contactsPager, onChange: this.onPagerChange }}
            loading={isFetching}
            components={components}
            rowClassName="editable-row"
          />
        </EditableContext.Provider>
      </div>
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
