import { Dimensions, StyleSheet } from 'react-native';

const { height } = Dimensions.get('screen');

export const styles = StyleSheet.create({
  container: {
    marginRight: 35,
    marginLeft: 35,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdown: {
    backgroundColor: '#DFF2ED',
    borderColor: '#65A693',
    borderWidth: 0.5,
    elevation: 3,
    borderRadius: 5,
  },
  textoDropdown: {
    color: '#025940',
    fontSize: 16,
  },
  dropDownContainerStyle: {
    backgroundColor: '#DFF2ED',
    borderColor: '#65A693',
    borderWidth: 0.5,
    elevation: 2,
    borderRadius: 5,
    zIndex: height * 3000,
  },
  itensLista: {
    color: '#025940',
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemSelecionado: {
    fontWeight: 'bold',
    color: '#8CBF1F',
  },
});