import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  buttonWithLabel: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
  },
  icon: {
    textAlign: 'center',
  },
  label: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
  },
});

