import React, { Component } from 'react';
import { Modal, View, TouchableOpacity } from 'react-native';
import styles from './styles';

class PopupDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: true,
    };
  }

  open() {
    this.setState({ modalVisible: true });
  }

  close() {
    this.setState({ modalVisible: false });
    if (this.props.onDismiss) {
      this.props.onDismiss();
    }
  }

  render() {
    return (
      <Modal
        transparent={true}
        ref={this.props.popupRef}
        visible={this.state.modalVisible}
        animationType="fade"
        supportedOrientations={['portrait', 'portrait-upside-down']}>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.mask}
            onPress={() => {
                if (this.props.dismissOnTouch) {
                  this.close();
                }
            }}
          />
          {this.props.children}
        </View>
      </Modal>
    );
  }
}

export default PopupDialog;
