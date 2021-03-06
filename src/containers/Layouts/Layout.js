import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as layoutActions from '../../actions/layout';
import * as settingsActions from '../../actions/settings';
import './Layout.css';
import logo from './logo.png';

const { Content, Sider } = Layout;

class LayoutContainer extends Component {
  constructor(props) {
    super(props);
    this.setSelectItem();
    this.props.settingsActions.handleLoadSettings();
  }

  // 注意:由于谷歌拓展是没有url的,所以判断都是无法进行的
  setSelectItem() {
    const key = this.props.menuSelectKeys;
    let path = `/${key}/`;
    if (this.props.menuSelectKeys.length === 0) {
      path = '/';
    }
    this.props.history.push(path);
  }

  handleSelect(item) {
    this.props.actions.handleSaveMenuSelectKeys([item.key]);
  }

  render() {
    // 传递props给子元素
    const { children } = this.props;
    const childrenWithProps = React.Children.map(children,
      child => React.cloneElement(child, { settings: this.props.settings }));

    // Menu项
    const menuItems = this.props.settings.functions.map((item) => {
      return item.status ?
        (
          <Menu.Item key={item.key}>
            <Icon type={item.iconType} style={{ fontSize: 15 }} />
            <span className="nav-text"><b style={{ fontSize: 15 }}>{item.name}</b></span>
            <Link to={`/${item.key}`} />
          </Menu.Item>
        ) : null;
    });
    return (
      <Layout className="layout">
        <Sider
          style={{ background: '#fff' }}
          className="sider"
          breakpoint="sm"
          collapsed={false}
        >
          <img src={logo} className="logo" alt="logo" />
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={this.props.menuSelectKeys}
            selectedKeys={this.props.menuSelectKeys}
            onClick={this.handleSelect.bind(this)}
          >
            <Menu.Item key="favourite">
              <Icon type="setting" style={{ fontSize: 15 }} />
              <span className="nav-text"><span style={{ fontSize: 15 }}>收藏项目</span></span>
              <Link to="/favourite" />
            </Menu.Item>
            {menuItems}
            <Menu.Item key="settings">
              <Icon type="setting" style={{ fontSize: 15 }} />
              <span className="nav-text"><span style={{ fontSize: 15 }}>设置</span></span>
              <Link to="/settings" />
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Content className="content">
            {childrenWithProps}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  return {
    menuSelectKeys: state.layout.menuSelectKeys,
    settings: state.settings,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(layoutActions, dispatch),
    settingsActions: bindActionCreators(settingsActions, dispatch),
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(LayoutContainer));
