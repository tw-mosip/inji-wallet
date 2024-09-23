import React from 'react';
import {View, Text} from 'react-native';

export const Result: React.FC<ResultProps> = props => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontSize: 20, marginBottom: 20}}>{props.status}</Text>
    </View>
  );
};

export default Result;

export interface ResultProps {
  status: string;
}
