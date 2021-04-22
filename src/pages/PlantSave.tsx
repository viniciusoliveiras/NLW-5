import React, { useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SvgFromUri } from 'react-native-svg';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { useRoute } from '@react-navigation/core';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import { format, isBefore } from 'date-fns';
import { useNavigation } from '@react-navigation/native';

import { Button } from '../components/Button';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

import { loadPlant, PlantProps, savePlant } from '../libs/storage';

import waterdrop from '../assets/waterdrop.png';

interface ParamsProps {
  plant: PlantProps;
}

export function PlantSave() {
  const navigation = useNavigation();
  const route = useRoute();
  const { plant } = route.params as ParamsProps;

  const [selectedDateTime, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS == 'ios');

  function handleChangeTime(event: Event, dateTime: Date | undefined) {
    if (Platform.OS == 'android') {
      setShowDatePicker((oldState) => !oldState);
    }

    if (dateTime && isBefore(dateTime, new Date())) {
      setSelectedDate(new Date());
      return Alert.alert('Escolha uma hora no futuro! ⌚');
    }

    if (dateTime) setSelectedDate(dateTime);
  }

  function handleOpenDateTimePickerForAndroid() {
    setShowDatePicker((oldState) => !oldState);
  }

  async function handleSave() {
    try {
      await savePlant({
        ...plant,
        dateTimeNotification: selectedDateTime,
      });

      navigation.navigate('Confirmation', {
        title: 'Tudo certo',
        subtitle:
          'Fique tranquilo que sempre vamos lembrar você de cuidar da sua plantinha com bastante amor.',
        buttonTitle: 'Muito obrigado :D',
        icon: 'hug',
        nextScreen: 'MyPlants',
      });
    } catch {
      Alert.alert(
        'Não foi possível salvar a planta 😢. Tente novamente depois'
      );
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.plantInfo}>
        <SvgFromUri uri={plant.photo} width={156} height={156} />
        <Text style={styles.plantName}>{plant.name}</Text>
        <Text style={styles.plantAbout}>{plant.about}</Text>
      </View>

      <View style={styles.controllers}>
        <View style={styles.tipContainer}>
          <Image source={waterdrop} style={styles.tipImage} />
          <Text style={styles.tipText}>{plant.water_tips}</Text>
        </View>

        <Text style={styles.alertLabel}>
          Ecolha o melhor horário para ser lembrado:
        </Text>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDateTime}
            mode='time'
            display='default'
            onChange={handleChangeTime}
          />
        )}

        {Platform.OS == 'android' && (
          <TouchableOpacity
            style={styles.dateTimePicker}
            onPress={handleOpenDateTimePickerForAndroid}
          >
            <Text style={styles.dateTimePickerText}>{`${format(
              selectedDateTime,
              'HH:mm a'
            )} `}</Text>
          </TouchableOpacity>
        )}

        <Button title='Cadastrar planta' onPress={handleSave} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: colors.shape,
    // paddingTop: Platform.OS === 'android' ? 5 : 0,
    // paddingBottom: Platform.OS === 'android' ? 5 : 0,
  },
  plantInfo: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.shape,
  },
  plantName: {
    fontFamily: fonts.heading,
    fontSize: 24,
    color: colors.heading,
    marginTop: 32,
  },
  plantAbout: {
    textAlign: 'center',
    fontFamily: fonts.text,
    color: colors.heading,
    fontSize: 17,
    lineHeight: 25,
    marginTop: 16,
  },
  controllers: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: getBottomSpace() || 20,
  },
  tipContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.blue_light,
    padding: 20,
    borderRadius: 20,
    position: 'relative',
    bottom: 70,
    marginBottom: 40,
  },
  tipImage: {
    width: 56,
    height: 56,
  },
  tipText: {
    flex: 1,
    marginLeft: 20,
    fontFamily: fonts.text,
    textAlign: 'center',
    color: colors.blue,
    fontSize: 15,
  },
  alertLabel: {
    textAlign: 'center',
    fontFamily: fonts.complement,
    color: colors.heading,
    fontSize: 16,
    marginBottom: 16,
  },
  dateTimePicker: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 40,
    marginBottom: 50,
  },
  dateTimePickerText: {
    color: colors.heading,
    fontSize: 30,
    fontFamily: fonts.text,
  },
});
