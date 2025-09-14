import React from 'react';
import {Keyboard, TouchableWithoutFeedback} from 'react-native';

const TemplateLogin = ({children}: any) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

export default TemplateLogin;
