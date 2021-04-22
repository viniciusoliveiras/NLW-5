import React from 'react';
import { Text, StyleSheet, SafeAreaView, Platform, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/core';

import { Button } from '../components/Button';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface ConfirmationPageProps {
  title: string;
  subtitle: string;
  buttonTitle: string;
  icon: 'smile' | 'hug';
  nextScreen: string;
}

const emojis = {
  smile: '😁',
  hug: '🤗',
};

export function Confirmation() {
  const navigation = useNavigation();
  const routes = useRoute();

  const {
    title,
    subtitle,
    buttonTitle,
    icon,
    nextScreen,
  } = routes.params as ConfirmationPageProps;

  function handleConfirmation() {
    navigation.navigate(nextScreen);
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>{emojis[icon]}</Text>

        <Text style={styles.title}>{title}</Text>

        <Text style={styles.subtitle}>{subtitle}</Text>

        <View style={styles.footer}>
          <Button title={buttonTitle} onPress={handleConfirmation} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
    paddingBottom: Platform.OS === 'android' ? 25 : 0,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 30,
  },
  emoji: { fontSize: 96, marginBottom: 64 },
  title: {
    fontSize: 24,
    fontFamily: fonts.heading,
    lineHeight: 30,
    textAlign: 'center',
    color: colors.heading,
    marginTop: 15,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: fonts.text,
    fontSize: 17,
    lineHeight: 25,   
    color: colors.gray,
    textAlign: 'center',
    paddingVertical: 10,
    width: 260,
  },
  footer: { width: '100%', paddingHorizontal: 50, marginTop: 40 },
});
