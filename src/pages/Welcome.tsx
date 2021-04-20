import React from 'react';
import {
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  Dimensions,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { Feather } from '@expo/vector-icons';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

import wateringImg from '../assets/watering.png';

export function Welcome() {
  const navigation = useNavigation();

  function handleStart() {
    navigation.navigate('UserIdentification');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>
          Gerencie {'\n'}
          suas plantas de {'\n'}
          forma fácil
        </Text>

        <Image source={wateringImg} style={styles.image} resizeMode='contain' />

        <Text style={styles.subtitle}>
          Não esqueça mais de regar suas {'\n'}
          plantas. Nós cuidamos de lembrar você {'\n'}
          sempre que precisar.
        </Text>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.7}
          onPress={handleStart}
        >
          <Feather name='chevron-right' style={styles.buttonIcon} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
    paddingBottom: Platform.OS === 'android' ? 25 : 0,
  },
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 34,
    textAlign: 'center',
    color: colors.heading,
    marginTop: 38,
  },
  image: { height: Dimensions.get('window').width * 0.7 },
  subtitle: {
    fontFamily: fonts.text,
    fontSize: 18,
    color: colors.heading,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: colors.green,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    marginBottom: 10,
    width: 56,
    height: 56,
  },
  buttonIcon: {
    color: colors.white,
    fontSize: 32,
  },
});
