import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import userImg from '../assets/user.png';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface HeaderProps {
  isHomeScreen: boolean;
}

export function Header({ isHomeScreen }: HeaderProps) {
  const [username, setUsername] = useState('');

  useEffect(() => {
    async function getUsername() {
      const user = await AsyncStorage.getItem('@plantmanager:user');

      setUsername(user || '');
    }

    getUsername();
  }, []);

  return (
    <View style={styles.container}>
      {isHomeScreen && (
        <View>
          <Text style={styles.greeting}>Olá,</Text>
          <Text style={styles.username}>{username}</Text>
        </View>
      )}

      {!isHomeScreen && (
        <View>
          <Text style={styles.greeting}>Minhas</Text>
          <Text style={styles.username}>Plantinhas</Text>
        </View>
      )}
      <Image source={userImg} style={styles.userImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    marginTop: getStatusBarHeight(),
  },
  greeting: { fontSize: 32, color: colors.heading, fontFamily: fonts.text },
  username: {
    fontSize: 32,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 40,
  },
  userImage: { width: 60, height: 60, borderRadius: 40 },
});
