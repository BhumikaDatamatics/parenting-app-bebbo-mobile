import { FormOuterCheckbox, LabelText } from '@components/shared/ChildSetupStyle';
import { Heading3, Heading3Regular } from '@styles/typography';
import React, { useState } from 'react';
import { View } from 'react-native';
import Checkbox, { CheckboxActive, CheckboxItem } from './shared/CheckboxStyle';
import { FDirRow } from './shared/FlexBoxStyle';
import Icon from './shared/Icon';
import { RadioInnerBox,RadioOuter, RadioLabelText, RadioBoxContainer} from './shared/radio';

const ToggleRadios = (props: any) => {
  const {options,tickColor,tickbgColor,defaultValue} = props;
  //console.log(defaultValue,"..defaultValue..")
  const [checkedItem, setCheckedItem] = useState(defaultValue);
 
  return (
    <>
    <RadioBoxContainer>
      <FDirRow>
        {options.map((item: typeof options[0], index: number) => {
          return (
            
              <RadioOuter key={index}
                >
                <RadioInnerBox
                  onPress={() => {
                    setCheckedItem(item);
                    props.getCheckedItem(item);
                  }}>
                  <CheckboxItem>
                    <View>
                    {(checkedItem?.title && checkedItem.title == item.title) ? (
                        <CheckboxActive style={{borderRadius: 50,backgroundColor:tickbgColor}}>
                          <Icon name="ic_tick" size={12} color={tickColor} />
                        </CheckboxActive>
                      ) : (
                        <Checkbox
                          style={{borderWidth: 1, borderRadius: 50}}></Checkbox>
                      )}
                    </View>
                  </CheckboxItem>
                  <View>
                  {(checkedItem?.title && checkedItem.title == item.title) ? (
                      <Heading3>{item.title}</Heading3>
                    ) : (
                      <Heading3Regular>{item.title}</Heading3Regular>
                    )}
                  </View>
                </RadioInnerBox>
              </RadioOuter>
              
          );
        })}
      </FDirRow></RadioBoxContainer>
    </>
  );
};
export default ToggleRadios;