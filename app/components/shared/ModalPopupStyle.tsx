import styled from 'styled-components/native';
const ModalPopupContainer = styled.View`
  background-color: ${(props) => props.theme.colors.SECONDARY_TEXTCOLOR};
  border-radius:${(props) => props.theme.borderRadius.BORDERRADIUS};
  padding: 20px 0px;
  align-items: center;
`;

export const PopupOverlay = styled.Pressable`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 20px;
`;

export const PopupCloseContainer = styled.Pressable`
  flex-direction: row;
  justify-content: flex-end;
  width: 100%;
`;
export const PopupClose = styled.Pressable`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-self:center; 
  right:0;
  top:-20px;
  width: 40px;
  height: 40px;
  /* position:absolute; */
  
`;
export const ModalPopupContent = styled.View`
  padding:10px 40px;
  margin-top:-35px
`;



export default ModalPopupContainer;